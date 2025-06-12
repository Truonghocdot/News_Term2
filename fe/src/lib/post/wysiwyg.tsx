'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import MenuBar from './menu-bar'
import { useEffect } from 'react'
import Image from '@tiptap/extension-image'
interface PropsTiptapEditor {
  value: string,
  onChange: (value: string) => void 

}

export default function TiptapEditor({
  value, onChange
}: PropsTiptapEditor) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({
        inline: false,
        allowBase64: true
      })
    ],
    editorProps : {
      attributes: {
        class: "prose max-w-none min-h-[200px] outline-none"
      }
    },
    content: value,
    onUpdate({editor}) {
      const html = editor.getHTML()
      onChange(html)
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])


  return (
    <div className="border rounded-xl p-4 bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px] outline-none prose max-w-none" />
    </div>
  )
}
