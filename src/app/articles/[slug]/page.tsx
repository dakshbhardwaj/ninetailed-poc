/* src/app/articles/[slug]/page.tsx */
import { BlogQueryResult, BlogItems, BlogItem } from "@/app/types";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

const client = createClient({
  space: process.env.SPACE_ID || "",
  accessToken: process.env.ACCESS_TOKEN || "",
});

const fetchBlogPost = async (slug: string): Promise<BlogItem> => {
  const queryOptions = {
    content_type: "blog",
    "fields.slug[match]": slug,
  };
  const queryResult = await client.getEntries(queryOptions);
  return queryResult.items[0] as any;
};

export default async function BlogPage(props: BlogPageProps) {
  const { params } = props;
  const { slug } = params;

  const article = await fetchBlogPost(slug);

  console.log(article);

  const { title, date, content, eventData } = article.fields;

  return (
    <main className="min-h-screen p-24 flex justify-center">
      <div className="max-w-2xl">
        <h1 className="font-extrabold text-3xl mb-2">{title}</h1>
        <p className="mb-6 text-slate-400 ">
          Posted on{" "}
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="[&>p]:mb-8 [&>h2]:font-extrabold">
          {documentToReactComponents(content)}
        </div>
        {eventData && <div className="mb-8">{eventData.author}</div>}
      </div>
    </main>
  );
}
