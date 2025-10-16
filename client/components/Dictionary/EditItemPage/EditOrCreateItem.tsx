"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  Button,
  EditOrCreateItemForm,
  IconSidebar,
  IconSidebarButton,
  TopContextMenu,
  TopContextMenuButton,
} from "@/components";

import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { TopContextMenuContextProvider } from "@/context/TopContextMenuContext";
import { EDIT_OR_CREATE_ITEM_FORM_ID } from "@/lib/constants";
import {
  itemSchemaWithPopulatedTranslations,
  ItemWithPopulatedTranslations,
} from "@/lib/contracts";
import paths from "@/lib/paths";
import { normalizeWithSchema } from "@/lib/utils";
import { GiSaveArrow } from "react-icons/gi";

interface EditOrCreateItemProps {
  item: ItemWithPopulatedTranslations;
  comingFrom?: string;
  addToUnit?: { listNumber: number; unitName: string; unitNumber: number };
}

export default function EditOrCreateItem({
  comingFrom,
  item,
  addToUnit,
}: EditOrCreateItemProps) {
  const normalizedItem = normalizeWithSchema(
    itemSchemaWithPopulatedTranslations,
    item
  );

  const methods = useForm<ItemWithPopulatedTranslations>({
    resolver: zodResolver(itemSchemaWithPopulatedTranslations),
    defaultValues: normalizedItem,
    mode: "onChange",
  });

  const { isSubmitting, isDirty, isValid } = methods.formState;

  return (
    <div className="flex grow">
      <FormProvider {...methods}>
        <IconSidebar position="left" showOn="tablet">
          <IconSidebarButton
            mode="back"
            label={comingFrom ? "Back to list" : "Back to dictionary"}
            link={comingFrom || paths.dictionaryPath()}
          />
          <IconSidebarButton
            form={EDIT_OR_CREATE_ITEM_FORM_ID}
            type="submit"
            mode="save"
            label="Save your changes"
            aria-label="Save your changes"
            disabled={isSubmitting || !isDirty || !isValid}
            busy={isSubmitting}
          />
        </IconSidebar>
        <EditOrCreateItemForm item={item} addToUnit={addToUnit} />
        <MobileMenuContextProvider>
          <TopContextMenuContextProvider>
            <TopContextMenu>
              <TopContextMenuButton
                mode="back"
                target="item"
                link={comingFrom || paths.dictionaryPath()}
              />
            </TopContextMenu>
          </TopContextMenuContextProvider>
        </MobileMenuContextProvider>
        {!isSubmitting && isDirty && isValid && (
          <Button
            form={EDIT_OR_CREATE_ITEM_FORM_ID}
            intent="bottomRightButton"
            className="z-10 tablet:hidden"
            aria-label="Save your changes"
            type="submit"
            busy={isSubmitting}
          >
            <GiSaveArrow className="h-8 w-8" />
          </Button>
        )}
      </FormProvider>
    </div>
  );
}
