from typing import List, Optional

class Badge:
    def __init__(self, name: str, criteria: str):
        self.name = name
        self.criteria = criteria

class Team:
    def __init__(self, name: str, lead: str, members: List[str]):
        self.name = name
        self.lead = lead
        self.members = members

class User:
    def __init__(
        self,
        id: str,
        username: str,
        email: str,
        quizzes_taken: int,
        score: int,
        badges: List[Badge],
        team: Optional[Team]
    ):
        self.id = id
        self.username = username
        self.email = email
        self.quizzes_taken = quizzes_taken
        self.score = score
        self.badges = badges
        self.team = team