import { getTranslations } from "next-intl/server";
import { getGreatWorkStage, greatWorkStages, type ReadingJourney } from "@/domain/reading-journey";

const stageSurface = {
  NIGREDO: "bg-muted",
  ALBEDO: "bg-background",
  CITRINITAS: "bg-secondary",
  RUBEDO: "bg-warm-accent/20",
} as const;

export async function GreatWorkJourney({ journey, locale }: { journey: ReadingJourney; locale: string }) {
  const t = await getTranslations("GreatWork");
  const stage = getGreatWorkStage(journey);
  const dateFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });
  const timeline = [
    ["startedAt", journey.startedAt],
    ["finishedAt", journey.finishedAt],
    ["assimilatedAt", journey.assimilatedAt],
  ] as const;

  return (
    <section aria-labelledby="journey-title" className="mt-14 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
      <h2 id="journey-title" className="mt-2 font-heading text-4xl text-brand sm:text-5xl">{t("title")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{stage ? t(`current.${stage}`) : t("abandoned")}</p>
      <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {greatWorkStages.map((step, index) => <li key={step} aria-current={stage === step ? "step" : undefined} className={`rounded-xl border p-4 ${stage === step ? `border-brand ${stageSurface[step]}` : "border-border bg-background/50"}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("step", { number: index + 1 })}</p>
          <h3 className="mt-3 font-heading text-3xl text-brand">{t(`stages.${step}.name`)}</h3>
          <p className="mt-1 text-xs font-medium text-foreground">{t(`stages.${step}.subtitle`)}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(`stages.${step}.description`)}</p>
        </li>)}
      </ol>
      {timeline.some(([, date]) => date) && <div className="mt-7 border-t border-border pt-6">
        <h3 className="text-sm font-semibold">{t("timeline")}</h3>
        <ol className="mt-3 flex flex-wrap gap-x-7 gap-y-3 text-sm">
          {timeline.map(([key, date]) => date && <li key={key}><span className="text-muted-foreground">{t(`dates.${key}`)}: </span><time dateTime={date.toISOString()}>{dateFormat.format(date)}</time></li>)}
        </ol>
      </div>}
    </section>
  );
}
