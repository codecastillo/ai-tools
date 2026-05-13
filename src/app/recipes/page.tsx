import { RECIPES } from '@/lib/recipes';
import { listApprovedTools } from '@/lib/db';
import RecipeCard from '@/components/recipe-card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Stack recipes · ai.tools',
  description:
    'Pre-built AI tool stacks with config snippets you can drop into your terminal.',
};

export default async function RecipesPage() {
  const { tools } = await listApprovedTools({ limit: 100 });
  const toolMap = new Map(tools.map((t) => [t.slug, t]));

  return (
    <div className="mx-auto max-w-screen-xl px-6 pb-20 pt-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-ink">
          Stack recipes
        </h1>
        <p className="mt-3 text-lg text-ink-dim">
          Pre-built AI tool stacks for common goals. Pick one, copy the config, ship.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {RECIPES.map((r) => (
          <RecipeCard key={r.slug} recipe={r} toolMap={toolMap} />
        ))}
      </section>
    </div>
  );
}
