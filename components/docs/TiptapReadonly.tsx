"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

type TiptapReadonlyProps = {
  content: Record<string, unknown>
}

export function TiptapReadonly({ content }: TiptapReadonlyProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "outline-none [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:md:text-4xl [&_h1]:mb-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:my-0 [&_p]:leading-7",
      },
    },
  })

  return <EditorContent editor={editor} />
}
