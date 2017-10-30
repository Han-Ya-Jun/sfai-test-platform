class Dao:
    def __init__(self, host: str, user: str, password: str, port: str, database: str):
        self.host = host
        self.user = user
        self.password = password
        self.port = port
        self.database = database
