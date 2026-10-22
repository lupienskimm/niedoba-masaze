type PageHeroProps = {
  title: string;
};

export function PageHero({ title }: PageHeroProps) {
  return (
    <div className="page-hero page-hero--text">
      <h1 className="page-hero__title">{title}</h1>
    </div>
  );
}
