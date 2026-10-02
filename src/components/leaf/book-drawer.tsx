"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { loadBookEditor } from "@/app/[locale]/books/actions";
import { BookForm } from "@/app/[locale]/books/book-form";
import type { BookInput } from "@/domain/book-input";
import { useRouter } from "@/i18n/navigation";

const BookDrawerContext = createContext<((id?: string) => void) | null>(null);

type EditorData = { id?: string; initial?: BookInput };

export function BookDrawerProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Books.form");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EditorData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [session, setSession] = useState(0);
  const requestRef = useRef(0);

  const openEditor = useCallback((id?: string) => {
    const request = ++requestRef.current;
    setData({ id });
    setSession(request);
    setLoading(true);
    setError(false);
    setOpen(true);
    loadBookEditor(id).then((result) => {
      if (request !== requestRef.current) return;
      if (result) setData(result);
      else setError(true);
      setLoading(false);
    }).catch(() => {
      if (request === requestRef.current) { setError(true); setLoading(false); }
    });
  }, []);

  const closeEditor = useCallback(() => {
    requestRef.current += 1;
    setOpen(false);
  }, []);
  const saved = useCallback(() => { closeEditor(); router.refresh(); }, [closeEditor, router]);

  return (
    <BookDrawerContext.Provider value={openEditor}>
      {children}
      <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) closeEditor(); }}>
        <Dialog.Portal>
          <Dialog.Backdrop className="book-drawer-backdrop fixed inset-0 z-50 bg-black/40" />
          <Dialog.Popup className="book-drawer-panel fixed inset-y-0 right-0 z-60 flex w-full max-w-2xl flex-col border-l border-border bg-background shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
              <div><Dialog.Title className="font-heading text-3xl font-semibold text-brand">{t(data.id ? "editTitle" : "newTitle")}</Dialog.Title><Dialog.Description className="mt-1 text-sm text-muted-foreground">{t("drawerDescription")}</Dialog.Description></div>
              <Dialog.Close className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/40" aria-label={t("close")}><X className="size-5" aria-hidden="true" /></Dialog.Close>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 sm:px-7">
              {loading ? <p role="status" className="py-10 text-sm text-muted-foreground">{t("loading")}</p>
                : error ? <p role="alert" className="py-10 text-sm text-destructive">{t("loadError")}</p>
                : <BookForm key={session} locale={locale} id={data.id} initial={data.initial} onSaved={saved} onCancel={closeEditor} />}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </BookDrawerContext.Provider>
  );
}

export function BookDrawerTrigger({ bookId, children, onClick, ...props }: ComponentProps<"button"> & { bookId?: string }) {
  const openEditor = useContext(BookDrawerContext);
  if (!openEditor) throw new Error("BookDrawerTrigger requires BookDrawerProvider");
  return <button {...props} type="button" aria-haspopup="dialog" onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) openEditor(bookId);
  }}>{children}</button>;
}
