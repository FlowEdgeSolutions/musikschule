import argparse

from app.security import hash_password


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an admin password hash.")
    parser.add_argument("password")
    args = parser.parse_args()
    print(hash_password(args.password))


if __name__ == "__main__":
    main()
