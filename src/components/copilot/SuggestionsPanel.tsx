import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Lightbulb, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Suggestion {
  id: string
  type: 'formula' | 'insight' | 'action'
  title: string
  description: string
  formula?: string
  confidence: number
  category: string
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[]
  onApplySuggestion: (suggestion: Suggestion) => void
}

export function SuggestionsPanel({ suggestions, onApplySuggestion }: SuggestionsPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (formula: string, id: string) => {
    try {
      await navigator.clipboard.writeText(formula)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'formula':
        return <Lightbulb className="h-4 w-4" />
      case 'insight':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'formula':
        return 'bg-blue-100 text-blue-800'
      case 'insight':
        return 'bg-green-100 text-green-800'
      case 'action':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions yet</h3>
          <p className="text-gray-600">Ask the AI Copilot to generate formulas, analyze data, or clean up your spreadsheet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
      
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(suggestion.type)}
                <CardTitle className="text-sm">{suggestion.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={getTypeColor(suggestion.type)}>
                  {suggestion.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {Math.round(suggestion.confidence * 100)}% confidence
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">{suggestion.description}</p>
            
            {suggestion.formula && (
              <div className="bg-gray-50 border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Formula:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(suggestion.formula!, suggestion.id)}
                    className="h-6 px-2 text-xs"
                  >
                    {copiedId === suggestion.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <code className="text-sm font-mono text-excel-green bg-white px-2 py-1 rounded border">
                  {suggestion.formula}
                </code>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className="bg-excel-green hover:bg-excel-green-light"
              >
                Apply
              </Button>
              {suggestion.formula && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(suggestion.formula!, suggestion.id)}
                >
                  {copiedId === suggestion.id ? 'Copied!' : 'Copy Formula'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}