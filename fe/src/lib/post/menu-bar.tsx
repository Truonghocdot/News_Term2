import { Editor } from '@tiptap/react'

type Props = {
  editor: Editor | null
}

const buttonClass = (active: boolean) =>
  `px-2 py-1 border rounded text-sm ${
    active ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-100 text-gray-700'
  }`

export default function MenuBar({ editor }: Props) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass(editor.isActive('heading', { level: 1 }))}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={buttonClass(editor.isActive('heading', { level: 3 }))}>
        H3
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClass(editor.isActive('paragraph'))}>
        P
      </button>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>
        Bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>
        Italic
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))}>
        Strike
      </button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={buttonClass(editor.isActive('highlight'))}>
        Highlight
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClass(editor.isActive({ textAlign: 'left' }))}>
        Left
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClass(editor.isActive({ textAlign: 'center' }))}>
        Center
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClass(editor.isActive({ textAlign: 'right' }))}>
        Right
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonClass(editor.isActive({ textAlign: 'justify' }))}>
        Justify
      </button>
    </div>
  )
}
