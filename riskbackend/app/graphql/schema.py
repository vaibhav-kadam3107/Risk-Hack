import strawberry
from typing import List, Optional
from app.db.config import db

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

@strawberry.type
class User:
    id: strawberry.ID
    username: str
    email: str
    quizzes_taken: int
    score: int
    badges: List[Badge]
    team: Optional[Team]

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
        return User(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            quizzes_taken=user["quizzesTaken"],
            score=user["score"],
            badges=badges,
            team=team_obj
        )

    @strawberry.field
    def leaderboard(self) -> List[User]:
        users = db.users.find().sort("score", -1).limit(10)
        result = []
        for user in users:
            badges = [Badge(**b) for b in user.get("badges", [])]
            team = user.get("team")
            team_obj = Team(**team) if team else None
            result.append(User(
                id=str(user["_id"]),
                username=user["username"],
                email=user["email"],
                quizzes_taken=user["quizzesTaken"],
                score=user["score"],
                badges=badges,
                team=team_obj
            ))
        return result

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
            "team": None
        }
        result = db.users.insert_one(user_doc)
        return User(
            id=str(result.inserted_id),
            username=username,
            email=email,
            quizzes_taken=0,
            score=0,
            badges=[],
            team=None
        )

    @strawberry.mutation
    def submit_quiz(self, user_id: strawberry.ID, score: int, badge: Optional[BadgeInput] = None) -> User:
        user = db.users.find_one({"_id": str(user_id)})
        if not user:
            raise Exception("User not found")
        new_quizzes = user["quizzesTaken"] + 1
        new_score = user["score"] + score
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
        return User(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            quizzes_taken=user["quizzesTaken"],
            score=user["score"],
            badges=badge_objs,
            team=team_obj
        )

schema = strawberry.Schema(query=Query, mutation=Mutation)