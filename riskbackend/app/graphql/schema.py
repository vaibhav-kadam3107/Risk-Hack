import strawberry
from typing import List, Optional
from app.db.config import db
from app.utility.gemini import evaluate_quiz_with_gemini

# --- Badge and Team ---
@strawberry.type
class Badge:
    name: str
    criteria: str

@strawberry.input
class BadgeInput:
    name: str
    criteria: str

@strawberry.type
class Team:
    name: str
    lead: str
    members: List[str]

# --- Peer Review ---
@strawberry.type
class PeerReview:
    reviewer_id: strawberry.ID
    review_text: str
    rating: int  # e.g., 1-5

@strawberry.input
class PeerReviewInput:
    reviewer_id: strawberry.ID
    review_text: str
    rating: int

# --- Quiz and Question ---
@strawberry.type
class Question:
    questionId: str
    text: str
    options: List[str]
    correctAnswer: Optional[str]  # Hide in frontend if needed

@strawberry.input
class QuestionInput:
    questionId: str
    text: str
    options: List[str]
    correctAnswer: Optional[str]

@strawberry.type
class Quiz:
    id: strawberry.ID
    quizName: str
    description: str
    questions: List[Question]
    evaluationType: str

@strawberry.input
class QuizInput:
    quizName: str
    description: str
    questions: List[QuestionInput]
    evaluationType: str

@strawberry.input
class QuizAnswerInput:
    questionId: str
    answer: str

@strawberry.type
class QuizEvaluation:
    score: Optional[float]
    feedback: str

# --- User ---
@strawberry.type
class User:
    id: strawberry.ID
    username: str
    email: str
    quizzes_taken: int
    score: int
    badges: List[Badge]
    team: Optional[Team]
    peer_reviews: Optional[List[PeerReview]] = None

# --- Query ---
@strawberry.type
class Query:
    @strawberry.field
    def user(self, id: strawberry.ID) -> Optional[User]:
        user = db.users.find_one({"_id": str(id)})
        if not user:
            return None
        badges = [Badge(**b) for b in user.get("badges", [])]
        team = user.get("team")
        team_obj = Team(**team) if team else None
        peer_reviews = [PeerReview(**r) for r in user.get("peer_reviews", [])] if "peer_reviews" in user else []
        return User(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            quizzes_taken=user.get("quizzesTaken", 0),
            score=user.get("score", 0),
            badges=badges,
            team=team_obj,
            peer_reviews=peer_reviews
        )

    @strawberry.field
    def leaderboard(self) -> List[User]:
        users = db.users.find().sort("score", -1).limit(10)
        result = []
        for user in users:
            badges = [Badge(**b) for b in user.get("badges", [])]
            team = user.get("team")
            team_obj = Team(**team) if team else None
            peer_reviews = [PeerReview(**r) for r in user.get("peer_reviews", [])] if "peer_reviews" in user else []
            result.append(User(
                id=str(user["_id"]),
                username=user["username"],
                email=user["email"],
                quizzes_taken=user.get("quizzesTaken", 0),
                score=user.get("score", 0),
                badges=badges,
                team=team_obj,
                peer_reviews=peer_reviews
            ))
        return result

    @strawberry.field
    def get_quizzes(self) -> List[Quiz]:
        quizzes = db.quizzes.find()
        result = []
        for quiz in quizzes:
            questions = [Question(**q) for q in quiz.get("questions", [])]
            result.append(Quiz(
                id=str(quiz["_id"]),
                quizName=quiz["quizName"],
                description=quiz["description"],
                questions=questions,
                evaluationType=quiz.get("evaluationType", "manual")
            ))
        return result

# --- Mutation ---
@strawberry.type
class Mutation:
    @strawberry.mutation
    def register_user(self, username: str, email: str) -> User:
        user_doc = {
            "username": username,
            "email": email,
            "quizzesTaken": 0,
            "score": 0,
            "badges": [],
            "team": None,
            "peer_reviews": []
        }
        result = db.users.insert_one(user_doc)
        return User(
            id=str(result.inserted_id),
            username=username,
            email=email,
            quizzes_taken=0,
            score=0,
            badges=[],
            team=None,
            peer_reviews=[]
        )

    @strawberry.mutation
    def submit_quiz(self, user_id: strawberry.ID, score: int, badge: Optional[BadgeInput] = None) -> User:
        user = db.users.find_one({"_id": str(user_id)})
        if not user:
            raise Exception("User not found")
        new_quizzes = user.get("quizzesTaken", 0) + 1
        new_score = user.get("score", 0) + score
        badges = user.get("badges", [])
        if badge:
            badges.append({"name": badge.name, "criteria": badge.criteria})
        db.users.update_one(
            {"_id": str(user_id)},
            {"$set": {"quizzesTaken": new_quizzes, "score": new_score, "badges": badges}}
        )
        user = db.users.find_one({"_id": str(user_id)})
        badge_objs = [Badge(**b) for b in user.get("badges", [])]
        team = user.get("team")
        team_obj = Team(**team) if team else None
        peer_reviews = [PeerReview(**r) for r in user.get("peer_reviews", [])] if "peer_reviews" in user else []
        return User(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            quizzes_taken=user.get("quizzesTaken", 0),
            score=user.get("score", 0),
            badges=badge_objs,
            team=team_obj,
            peer_reviews=peer_reviews
        )

    @strawberry.mutation
    def add_quiz(self, quiz: QuizInput) -> Quiz:
        quiz_doc = {
            "quizName": quiz.quizName,
            "description": quiz.description,
            "questions": [q.__dict__ for q in quiz.questions],
            "evaluationType": quiz.evaluationType
        }
        result = db.quizzes.insert_one(quiz_doc)
        questions = [Question(**q) for q in quiz_doc["questions"]]
        return Quiz(
            id=str(result.inserted_id),
            quizName=quiz.quizName,
            description=quiz.description,
            questions=questions,
            evaluationType=quiz.evaluationType
        )

    @strawberry.mutation
    def submit_quiz_for_evaluation(
        self,
        user_id: strawberry.ID,
        quiz_id: strawberry.ID,
        answers: List[QuizAnswerInput]
    ) -> QuizEvaluation:
        quiz = db.quizzes.find_one({"_id": str(quiz_id)})
        if not quiz:
            raise Exception("Quiz not found")
        quiz_name = quiz["quizName"]
        user_answers = {a.questionId: a.answer for a in answers}
        evaluation = evaluate_quiz_with_gemini(quiz_name, user_answers)
        db.users.update_one(
            {"_id": str(user_id)},
            {"$push": {"quiz_results": {
                "quiz_id": str(quiz_id),
                "score": evaluation["score"],
                "feedback": evaluation["feedback"],
                "answers": user_answers
            }}}
        )
        return QuizEvaluation(score=evaluation["score"], feedback=evaluation["feedback"])

    @strawberry.mutation
    def submit_peer_review(
        self,
        user_id: strawberry.ID,
        review: PeerReviewInput
    ) -> bool:
        db.users.update_one(
            {"_id": str(user_id)},
            {"$push": {"peer_reviews": {
                "reviewer_id": str(review.reviewer_id),
                "review_text": review.review_text,
                "rating": review.rating
            }}}
        )
        return True

schema = strawberry.Schema(query=Query, mutation=Mutation)