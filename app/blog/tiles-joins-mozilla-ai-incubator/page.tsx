"use client";

import { useMemo } from "react";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-posts";
import { BlogPostContent } from "@/components/blog-post-content";

export default function TilesJoinsMozillaAiIncubatorPage() {
  const post = blogPosts.find(
    (p) => p.slug === "tiles-joins-mozilla-ai-incubator",
  );

  const formattedDate = useMemo(() => {
    if (!post) return "";
    return post.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }, [post]);

  if (!post) {
    return null;
  }

  return (
    <BlogPostContent
      title={post.title}
      description={post.description}
      date={formattedDate}
      authorId={post.author}
      coverImage={post.coverImage ?? "/og-image.jpg"}
      coverImageDark={post.coverImageDark ?? post.coverImage ?? "/og-image.jpg"}
      coverAlt={post.coverAlt ?? post.title}
      coverImageWidth={1200}
      coverImageHeight={630}
      standardSiteDocumentUri={post.standardSiteDocumentUri}
      blueskyPostUri={post.blueskyPostUri}
      content={post.content}
      showTableOfContents={false}
    >
      <p>
        Today, Tiles is joining Mozilla Foundation&rsquo;s{" "}
        <a
          href="https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Human-Scale AI Incubator
        </a>{" "}
        as one of three anchor projects. The Incubator brings together teams
        building purpose-built technology, sized to the problems they are meant
        to solve.
      </p>

      <p>
        Privacy has historically been a niche market. I believe AI will change
        that. AI assistants and agent swarms are becoming the interface for more
        of our daily work, from knowledge work and coding to browsing. As that
        happens, attacks and data leaks will affect more people. Tiles is our
        bet that people will want tools that keep their data, identity, and
        control in their own hands.
      </p>

      <p>
        For us, the hard part is building the underlying privacy technology and
        a sustainable business, not another chat interface. ChatGPT has already
        set a strong standard for how AI assistants look and feel. We can learn
        from those patterns while making Tiles distinctly ours: more playful,
        more human, and guided by the belief that work can feel like play. We
        want to build humane software, using polish to serve the user rather
        than drive addiction or endless engagement. Underneath, we are
        integrating local models and agent harnesses, building peer-to-peer
        networking, and creating zero-trust identity and authorization for
        people and agents. The goal is a decentralized, user-owned stack built
        to last, without ads or incentives that work against users.
      </p>

      <p>
        That is why becoming an anchor project matters so much: it gives us
        time.
      </p>

      <p>
        Mozilla&rsquo;s support provides us with 18 months of runway for four
        full-time team members, one student on a short-term placement, and one
        legal consultant. Our core team brings together engineers with
        experience in cybersecurity, gaming, and peer-to-peer technologies, and
        a designer with a background in direct-to-consumer brands. Our legal
        consultant specializes in technology law and will work on the
        governance, risk, and compliance aspects of Tiles deployments with our
        pilot partners. This support gives us the freedom to build the local AI
        product we believe in without giving up equity or control.
      </p>

      <figure className="my-8 lg:my-10">
        <Image
          src="/team.webp"
          alt="The five members of the Tiles Privacy team standing together outdoors."
          width={1600}
          height={1200}
          sizes="(max-width: 768px) calc(100vw - 3rem), 44rem"
          className="h-auto w-full rounded-lg"
        />
        <figcaption className="mt-2 text-sm text-black/48 dark:text-white/48">
          Members of the Tiles Privacy team.
        </figcaption>
      </figure>

      <p>
        During that time, we&rsquo;ll work closely with Mozilla Foundation and
        the broader Human-Scale AI cohort through regular discussions, coaching,
        feedback, and community engagement.
      </p>

      <p>
        We also plan to run practical pilots with nonprofits and educational
        institutions serving charitable and public-interest goals. Working in
        real settings will show us what people need and help us set better
        product priorities. The pilots will let us deploy carefully, learn from
        students, educators, program leaders, and communities, and make
        thoughtful decisions without the pressure of a sales cycle.
      </p>

      <p>
        These pilots will also shape a governance and safeguarding framework for
        responsible institutional use. We will release it under an open-source
        license so nonprofits, schools, universities, and other organizations
        can adapt it for their own communities.
      </p>

      <p>
        For me, long-term success is straightforward: Tiles becomes
        self-sustaining through user and enterprise revenue, giving us the
        independence to keep building.
      </p>

      <p>
        Seven more spots are open now with up to $500k over two years in
        non-dilutive funding. Applications close November 20, 2026. If
        you&rsquo;re building AI for a language, place, or need that mainstream
        systems overlook, we&rsquo;d love to have you with us. Learn more and
        apply through the{" "}
        <a
          href="https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Human-Scale AI Incubator
        </a>
        .
      </p>

      <p>
        We&rsquo;re grateful for Mozilla Foundation&rsquo;s support and excited
        about what it will help us build next. We also want to thank our
        sponsors, advisors, and every member of the User &amp; Agents community
        who played a vital role in helping Tiles reach this milestone.
      </p>
    </BlogPostContent>
  );
}
