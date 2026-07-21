import Image from "next/image";
import type { CmsPost } from "@/lib/cms/types";
import { fonts, tokens } from "./theme";

export const NewsSection = ({ posts }: { posts: CmsPost[] }) => {
  const publishedPosts = posts.filter((post) => post.status === "published");

  if (publishedPosts.length === 0) return null;

  return (
    <section
      id="aktuelles"
      style={{
        background: tokens.color.warmWhite,
        padding: "100px 8%",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 44 }}>
          <div className="gold-line" style={{ marginBottom: 24 }} />
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              letterSpacing: 3.5,
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.55)",
              marginBottom: 12,
            }}
          >
            Aktuelles
          </p>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(28px, 3.5vw, 46px)",
              fontWeight: 500,
              color: tokens.color.ink,
              lineHeight: 1.15,
            }}
          >
            Beiträge <span style={{ fontStyle: "italic", color: tokens.color.gold }}>und Hinweise</span>
          </h2>
        </div>

        <div className="news-grid">
          {publishedPosts.map((post) => (
            <article className="news-card" key={post.id}>
              {post.imageUrl ? (
                <div className="news-card__image">
                  <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ) : null}
              <div className="news-card__body">
                <p>{post.category}</p>
                <h3>{post.title}</h3>
                <span>{post.publishedAt}</span>
                <p>{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
