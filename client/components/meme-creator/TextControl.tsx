import { useRef } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { TextBox } from './types';

interface TextControlProps {
  box: TextBox;
  onTextChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onFontSizeChange: (id: string, increase: boolean) => void;
  onColorChange: (id: string, color: string) => void;
}

export const TextControl: React.FC<TextControlProps> = ({
    box,
    onTextChange,
    onRemove,
    onFontSizeChange,
    onColorChange,
  }: {
    box: TextBox;
    onTextChange: (id: string, text: string) => void;
    onRemove: (id: string) => void;
    onFontSizeChange: (id: string, increase: boolean) => void;
    onColorChange: (id: string, color: string) => void;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
  
    return (
      <div className="flex flex-col gap-2 w-full bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            defaultValue={box.text} // Use defaultValue instead of value
            onBlur={(e) => onTextChange(box.id, e.target.value)} // Update state only on blur
            className="flex-1 bg-transparent border-none outline-none text-white text-lg"
            placeholder="Enter text"
          />
          <button
            onClick={() => onRemove(box.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFontSizeChange(box.id, false)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-300">
            Font Size: {box.fontSize}px
          </span>
          <button
            onClick={() => onFontSizeChange(box.id, true)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <input
            type="color"
            value={box.color}
            onChange={(e) => onColorChange(box.id, e.target.value)}
            className="ml-auto w-8 h-8 rounded cursor-pointer"
          />
        </div>
      </div>
    );
  };