import { PageNav } from "@/components/PageNav";

type PageHeroProps = {
  title: string;
};

export function PageHero({ title }: PageHeroProps) {
  return (
    <div className="page-hero page-hero--text">
      <div className="page-hero__bar">
        <div className="wrap">
          <PageNav />
        </div>
      </div>
      <h1 className="page-hero__title">{title}</h1>
    </div>
  );
}
