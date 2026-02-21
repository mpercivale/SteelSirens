
"use client";

import { motion } from "framer-motion";
import type { Objeto, Categoria } from "@/types/game";
import ItemCard from "./ItemCard";
import { getItemCategoryName, getItemCategoryDescription, type Language } from "@/lib/i18n";

interface Props {
  items: Objeto[];
  categories: Categoria[];
  lang: Language;
}

export default function ItemsExplorer({ items, categories, lang }: Props) {
  const itemCategories = categories.filter((category) => category.type === "item");
  const categoriesById = Object.fromEntries(itemCategories.map((category) => [category.id, category]));

  const parentCategories = itemCategories
    .filter((category) => !category.categoria_padre_id)
    .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));

  const getParentCategoryId = (item: Objeto) => {
    const categoryId = item.categoria_id;
    const subcategoryId = item.subcategoria_id;

    if (subcategoryId && categoriesById[subcategoryId]?.categoria_padre_id) {
      return categoriesById[subcategoryId].categoria_padre_id;
    }

    if (categoryId && categoriesById[categoryId]?.categoria_padre_id) {
      return categoriesById[categoryId].categoria_padre_id;
    }

    return categoryId;
  };

  return (
    <div className="space-y-16">
      {parentCategories.map((parent, parentIndex) => {
        const subcategories = itemCategories
          .filter((category) => category.categoria_padre_id === parent.id)
          .sort((left, right) => (left.order ?? 999) - (right.order ?? 999));

        const parentItems = items.filter((item) => getParentCategoryId(item) === parent.id);

        if (parentItems.length === 0) {
          return null;
        }

        const directItems = parentItems.filter((item) => !item.subcategoria_id);

        return (
          <motion.section
            key={parent.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: parentIndex * 0.05 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h2 className="souls-title text-xl sm:text-2xl text-[oklch(0.72_0.08_75)] tracking-widest">
                {getItemCategoryName(lang, parent.id, parent.nombre)}
              </h2>
              <div className="h-px flex-1 bg-[oklch(0.72_0.08_75/20%)]" />
              <span className="text-xs souls-title tracking-widest text-[oklch(0.45_0.01_60)]">
                {parentItems.length}
              </span>
            </div>

            {parent.descripcion && (
              <p className="souls-text text-sm text-[oklch(0.55_0.01_60)] max-w-3xl">
                {getItemCategoryDescription(lang, parent.id, parent.descripcion)}
              </p>
            )}

            {directItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {directItems.map((item, index) => (
                  <ItemCard key={item.id} item={item} index={index} lang={lang} />
                ))}
              </div>
            )}

            {subcategories.map((subcategory) => {
              const subItems = parentItems.filter(
                (item) => item.subcategoria_id === subcategory.id || item.categoria_id === subcategory.id
              );

              if (subItems.length === 0) {
                return null;
              }

              return (
                <div key={subcategory.id} className="space-y-3">
                  <div className="flex items-center gap-3 pl-1">
                    <h3 className="souls-title text-xs sm:text-sm tracking-widest text-[oklch(0.55_0.01_60)]">
                      {getItemCategoryName(lang, subcategory.id, subcategory.nombre)}
                    </h3>
                    <div className="h-px flex-1 bg-[oklch(0.72_0.08_75/12%)]" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {subItems.map((item, index) => (
                      <ItemCard key={item.id} item={item} index={index} lang={lang} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.section>
        );
      })}

      {parentCategories.length === 0 && (
        <div className="text-center py-20">
          <p className="souls-title text-sm tracking-widest text-[oklch(0.45_0.01_60)]">
            No item categories available yet...
          </p>
        </div>
      )}
    </div>
  );
}
