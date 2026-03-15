"use client";

import { createContext, useReducer, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { departmentInfoContent } from "@/data/departmentInfo";

export const ContentStateContext = createContext(null);
export const ContentDispatchContext = createContext(null);

let blockIdCounter = 0;
function generateBlockId() {
  blockIdCounter += 1;
  return `blk-${Date.now()}-${blockIdCounter}`;
}

const initialState = {
  contentTypes: [],
  contentsByType: {},
  contentBySlug: {},
  selectedTypeSlug: null,
  selectedContentId: null,
  contentsLoading: false,
  isPanelOpen: false,
  dirtyContentSlugs: new Set(),
};

function contentReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_PANEL":
      return { ...state, isPanelOpen: !state.isPanelOpen };
    case "SET_PANEL_OPEN":
      return { ...state, isPanelOpen: action.payload };

    case "CONTENT_TYPES_SUCCESS": {
      return { ...state, contentTypes: action.payload };
    }

    case "CONTENTS_LOADING":
      return { ...state, contentsLoading: true };
    case "CONTENTS_SUCCESS": {
      const { typeSlug, contents } = action.payload;
      const bySlug = { ...state.contentBySlug };
      contents.forEach((c) => {
        bySlug[c.slug] = c;
      });
      return {
        ...state,
        contentsLoading: false,
        contentsByType: { ...state.contentsByType, [typeSlug]: contents },
        contentBySlug: bySlug,
      };
    }
    case "CONTENT_LOADED": {
      const content = action.payload;
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [content.slug]: content },
      };
    }
    case "CREATE_CONTENT": {
      const newContent = action.payload;
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(newContent.slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [newContent.slug]: newContent },
        selectedContentId: newContent.id,
        dirtyContentSlugs: newDirty,
      };
    }

    case "SELECT_TYPE":
      return {
        ...state,
        selectedTypeSlug: action.payload,
        selectedContentId: null,
      };
    case "SELECT_CONTENT":
      return { ...state, selectedContentId: action.payload };
    case "NAVIGATE_BACK": {
      if (state.selectedContentId) {
        return { ...state, selectedContentId: null };
      }
      if (state.selectedTypeSlug) {
        return { ...state, selectedTypeSlug: null };
      }
      return state;
    }

    case "UPDATE_CONTENT_FIELD": {
      const { slug, field, value } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const updated = { ...content, [field]: value };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }
    case "UPDATE_CONTENT_BLOCK": {
      const { slug, blockIndex, block } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const blocks = [...content.blocks];
      blocks[blockIndex] = block;
      const updated = { ...content, blocks };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }
    case "ADD_BLOCK": {
      const { slug, block, afterIndex } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const blocks = [...content.blocks];
      const insertAt = afterIndex !== undefined ? afterIndex + 1 : blocks.length;
      blocks.splice(insertAt, 0, { ...block, id: block.id || generateBlockId() });
      const updated = { ...content, blocks };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }
    case "REMOVE_BLOCK": {
      const { slug, blockIndex } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const blocks = content.blocks.filter((_, i) => i !== blockIndex);
      const updated = { ...content, blocks };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }
    case "MOVE_BLOCK": {
      const { slug, fromIndex, toIndex } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const blocks = [...content.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      const updated = { ...content, blocks };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }
    case "UPDATE_CONTENT_METADATA": {
      const { slug, key, value } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const metadata = { ...content.metadata, [key]: value };
      const updated = { ...content, metadata };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }

    case "UPDATE_METADATA_ITEM": {
      const { slug, metaKey, itemIndex, field, value } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const arr = [...(content.metadata[metaKey] || [])];
      arr[itemIndex] = { ...arr[itemIndex], [field]: value };
      const metadata = { ...content.metadata, [metaKey]: arr };
      const updated = { ...content, metadata };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }

    case "UPDATE_METADATA_OBJECT_FIELD": {
      const { slug, metaKey, field, value } = action.payload;
      const content = state.contentBySlug[slug];
      if (!content) return state;
      const obj = { ...(content.metadata[metaKey] || {}), [field]: value };
      const metadata = { ...content.metadata, [metaKey]: obj };
      const updated = { ...content, metadata };
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.add(slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [slug]: updated },
        dirtyContentSlugs: newDirty,
      };
    }

    case "SAVE_SUCCESS": {
      const saved = action.payload;
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.delete(saved.slug);
      return {
        ...state,
        contentBySlug: { ...state.contentBySlug, [saved.slug]: saved },
        dirtyContentSlugs: newDirty,
      };
    }
    case "MARK_CLEAN": {
      const newDirty = new Set(state.dirtyContentSlugs);
      newDirty.delete(action.payload);
      return { ...state, dirtyContentSlugs: newDirty };
    }

    default:
      return state;
  }
}

export function ContentProvider({ children }) {
  const { isAdmin, isEditor } = useAuth();
  const [state, dispatch] = useReducer(contentReducer, initialState);

  const canManageContent = isAdmin || isEditor;

  useEffect(() => {
    if (!canManageContent) return;
    dispatch({ type: "CONTENT_LOADED", payload: departmentInfoContent });
  }, [canManageContent]);

  const actions = useCallback(
    () => ({
      togglePanel: () => dispatch({ type: "TOGGLE_PANEL" }),
      setPanelOpen: (open) =>
        dispatch({ type: "SET_PANEL_OPEN", payload: open }),
      selectType: (typeSlug) =>
        dispatch({ type: "SELECT_TYPE", payload: typeSlug }),
      selectContent: (contentId) =>
        dispatch({ type: "SELECT_CONTENT", payload: contentId }),
      navigateBack: () => dispatch({ type: "NAVIGATE_BACK" }),
      updateField: (slug, field, value) =>
        dispatch({
          type: "UPDATE_CONTENT_FIELD",
          payload: { slug, field, value },
        }),
      updateBlock: (slug, blockIndex, block) =>
        dispatch({
          type: "UPDATE_CONTENT_BLOCK",
          payload: { slug, blockIndex, block },
        }),
      addBlock: (slug, block, afterIndex) =>
        dispatch({ type: "ADD_BLOCK", payload: { slug, block, afterIndex } }),
      removeBlock: (slug, blockIndex) =>
        dispatch({ type: "REMOVE_BLOCK", payload: { slug, blockIndex } }),
      moveBlock: (slug, fromIndex, toIndex) =>
        dispatch({
          type: "MOVE_BLOCK",
          payload: { slug, fromIndex, toIndex },
        }),
      updateMetadata: (slug, key, value) =>
        dispatch({
          type: "UPDATE_CONTENT_METADATA",
          payload: { slug, key, value },
        }),
      updateMetadataItem: (slug, metaKey, itemIndex, field, value) =>
        dispatch({
          type: "UPDATE_METADATA_ITEM",
          payload: { slug, metaKey, itemIndex, field, value },
        }),
      updateMetadataObjectField: (slug, metaKey, field, value) =>
        dispatch({
          type: "UPDATE_METADATA_OBJECT_FIELD",
          payload: { slug, metaKey, field, value },
        }),
      createContent: (slug, title) =>
        dispatch({
          type: "CREATE_CONTENT",
          payload: {
            id: `page-${slug.replace(/\//g, "-")}`,
            slug,
            title,
            type: { slug: "sayfalar", name: "Sayfalar" },
            isPublished: false,
            coverImage: null,
            blocks: [],
            metadata: {},
          },
        }),
      dispatch,
    }),
    []
  );

  return (
    <ContentStateContext.Provider value={{ ...state, canManageContent }}>
      <ContentDispatchContext.Provider value={actions()}>
        {children}
      </ContentDispatchContext.Provider>
    </ContentStateContext.Provider>
  );
}