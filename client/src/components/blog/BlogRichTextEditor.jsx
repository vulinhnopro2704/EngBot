"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Link, Quote, Code, Heading1, Heading2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const BlogRichTextEditor = ({ value, onChange }) => {
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 })

  const handleTextSelect = (e) => {
    const start = e.target.selectionStart
    const end = e.target.selectionEnd

    if (start !== end) {
      setSelectedText({ start, end })
    }
  }

  const applyFormatting = (formatType) => {
    if (selectedText.start === selectedText.end) return

    const beforeSelection = value.substring(0, selectedText.start)
    const selection = value.substring(selectedText.start, selectedText.end)
    const afterSelection = value.substring(selectedText.end)

    let formattedText = ""

    switch (formatType) {
      case "bold":
        formattedText = `${beforeSelection}**${selection}**${afterSelection}`
        break
      case "italic":
        formattedText = `${beforeSelection}*${selection}*${afterSelection}`
        break
      case "heading1":
        formattedText = `${beforeSelection}# ${selection}${afterSelection}`
        break
      case "heading2":
        formattedText = `${beforeSelection}## ${selection}${afterSelection}`
        break
      case "link":
        formattedText = `${beforeSelection}[${selection}](url)${afterSelection}`
        break
      case "quote":
        formattedText = `${beforeSelection}> ${selection}${afterSelection}`
        break
      case "code":
        formattedText = `${beforeSelection}\`${selection}\`${afterSelection}`
        break
      case "unordered-list":
        formattedText = `${beforeSelection}\n- ${selection}${afterSelection}`
        break
      case "ordered-list":
        formattedText = `${beforeSelection}\n1. ${selection}${afterSelection}`
        break
      default:
        formattedText = value
    }

    onChange(formattedText)
  }

  const formatButtons = [
    { icon: <Bold className="h-4 w-4" />, action: "bold", tooltip: "Bold" },
    { icon: <Italic className="h-4 w-4" />, action: "italic", tooltip: "Italic" },
    { icon: <Heading1 className="h-4 w-4" />, action: "heading1", tooltip: "Heading 1" },
    { icon: <Heading2 className="h-4 w-4" />, action: "heading2", tooltip: "Heading 2" },
    { icon: <List className="h-4 w-4" />, action: "unordered-list", tooltip: "Bullet List" },
    { icon: <ListOrdered className="h-4 w-4" />, action: "ordered-list", tooltip: "Numbered List" },
    { icon: <Link className="h-4 w-4" />, action: "link", tooltip: "Link" },
    { icon: <Quote className="h-4 w-4" />, action: "quote", tooltip: "Quote" },
    { icon: <Code className="h-4 w-4" />, action: "code", tooltip: "Code" },
  ]

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden transition-colors duration-200">
      <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 transition-colors duration-200">
        <TooltipProvider>
          {formatButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => applyFormatting(button.action)}
                >
                  {button.icon}
                  <span className="sr-only">{button.tooltip}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextSelect}
        placeholder="Write your post content here... Use the toolbar to format your text."
        className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-y"
      />

      <div className="bg-gray-50 dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
        <p>Tip: You can also use Markdown syntax directly in the editor.</p>
      </div>
    </div>
  )
}

export default BlogRichTextEditor

