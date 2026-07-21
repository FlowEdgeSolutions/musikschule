from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models


def seed_defaults(db: Session) -> None:
    has_site = db.scalar(select(models.SiteContent.id).limit(1))
    if has_site:
        return

    db.add(
        models.SiteContent(
            id=1,
            hero_eyebrow="Private Musikakademie - Hamburg-Altona - Seit 1987",
            hero_title_line1="Alfred Schnittke",
            hero_title_accent="Akademie",
            hero_title_line2="International",
            hero_subtitle=(
                "Wo zeitgenoessische Musik auf Tradition trifft - Studium, Konzerte "
                "und Meisterkurse in einer hanseatischen Villa"
            ),
            about_kicker="Ueber die Akademie",
            about_title_line1="Musik studieren",
            about_title_accent="unter einem neuen Akzent",
            about_lead=(
                "Die Alfred Schnittke Akademie International ist eine private Musikakademie "
                "in Hamburg-Altona. Seit 1987 bilden wir junge Musiker in Gesang und "
                "Instrumentalspiel aus."
            ),
        )
    )

    db.add_all(
        [
            models.Event(
                id="event-1",
                title="Schnittke: Streichquartett Nr. 3",
                category="Konzert",
                date="15. Maerz 2026",
                time="19:30 Uhr",
                location="Konzertsaal",
                description="Ein Konzertabend mit Werken von Alfred Schnittke und Zeitgenossen.",
                seats_label="42 Plaetze frei",
                color="#7A0000",
                status="published",
                ticket_enabled=True,
            ),
            models.Event(
                id="event-2",
                title="Meisterkurs Violine",
                category="Meisterkurs",
                date="22. Maerz 2026",
                time="10:00 Uhr",
                location="Kammermusikraum",
                description="Oeffentlicher Meisterkurs fuer fortgeschrittene Studierende.",
                seats_label="8 Plaetze frei",
                color="#D00000",
                status="published",
                ticket_enabled=True,
            ),
        ]
    )

    db.add(
        models.Post(
            id="post-1",
            title="Neue Meisterkurse im Fruehjahr",
            slug="neue-meisterkurse-im-fruehjahr",
            category="Akademie",
            excerpt="Die Akademie erweitert ihr Kursprogramm um neue Formate.",
            body="Details zu Terminen, Dozenten und Teilnahmebedingungen folgen in Kuerze.",
            published_at="2026-03-01",
            status="published",
        )
    )
    db.commit()
