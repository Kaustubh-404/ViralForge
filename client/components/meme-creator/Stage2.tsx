import React from "react";
import { Plus } from "lucide-react";
import { TextBox } from "./types";
import { DraggableText } from "./DraggableText";
import { TextControl } from "./TextControl";
import { generateMemeCanvas } from "./helper";
import { createMeme, uploadImage } from "@/lib/utils";
import { MemeSchema } from "@/true-network/schema";
import { TrueApi } from "@truenetworkio/sdk";
import { useAccount } from "wagmi";

interface Stage2Props {
  capturedImage: string | null;
  textBoxes: TextBox[];
  setTextBoxes: React.Dispatch<React.SetStateAction<TextBox[]>>;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  setFinalMeme: (meme: string | null) => void;
  setStage: (stage: number) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string) => void;
  trueApi?: TrueApi;
  memeTemplate: number;
}

const Stage2: React.FC<Stage2Props> = ({
  capturedImage,
  textBoxes,
  setTextBoxes,
  imageContainerRef,
  setFinalMeme,
  setStage,
  setIsLoading,
  setLoadingMessage,
  trueApi,
  memeTemplate,
}) => {
  const addTextBox = () => {
    const newBox: TextBox = {
      id: `text-${Date.now()}`,
      text: "Add text here",
      position: { x: 50, y: 50 },
      fontSize: 24,
      color: "#FFFFFF",
    };
    setTextBoxes((prev) => [...prev, newBox]);
  };

  const account = useAccount();

  const generateMeme = async () => {
    if (!imageContainerRef.current || !capturedImage) return;

    setIsLoading(true);
    setLoadingMessage("Generating your meme...");

    try {
      const container = imageContainerRef.current;
      const { width, height } = container.getBoundingClientRect();

      const memeDataUrl = await generateMemeCanvas(
        capturedImage,
        textBoxes,
        width,
        height
      );

      try {
        const cid = await uploadImage(memeDataUrl.replace(/^data:image\/\w+;base64,/, ""));

        await createMeme({
          address: account.address as string,
          cid: cid,
          templateId: memeTemplate.toString()
        });

      } catch (error) {
        console.error("Error uploading to IPFS:", error);
      }

      setFinalMeme(memeDataUrl);
      setStage(3);
    } catch (error) {
      console.error("Error generating meme:", error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full h-[70vh] bg-gray-900 rounded-lg overflow-hidden mb-4">
        {capturedImage && (
          <div
            ref={imageContainerRef}
            className="relative w-full h-[70vh] bg-gray-900 rounded-lg overflow-hidden mb-4 image-container"
            onTouchMove={(e) => e.preventDefault()} // Prevent pull-to-refresh
          >
            <img
              src={capturedImage}
              alt="Template"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {textBoxes.map((box) => (
          <DraggableText
            key={box.id}
            box={box}
            onMove={(id, newPosition) => {
              setTextBoxes((prev) =>
                prev.map((b) =>
                  b.id === id ? { ...b, position: newPosition } : b
                )
              );
            }}
          />
        ))}
      </div>
      <div className="w-full space-y-4">
        <div className="flex sm:flex-row w-full gap-4 px-4 items-center justify-center">
          <button
            onClick={addTextBox}
            className="w-3/12 sm:w-auto px-6 py-4 bg-gray-700 rounded-lg hover:bg-gray-600 
                     transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={generateMeme}
            className="w-9/12 sm:w-auto px-6 py-4 bg-blue-500 rounded-lg hover:bg-blue-600 
                     transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            Generate Meme
          </button>
        </div>

        {textBoxes.length > 0 && (
          <div className="px-4 space-y-3">
            {textBoxes.map((box) => (
              <TextControl
                key={box.id}
                box={box}
                onTextChange={(id, newText) => {
                  setTextBoxes((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, text: newText } : b))
                  );
                }}
                onRemove={(id) => {
                  setTextBoxes((prev) => prev.filter((b) => b.id !== id));
                }}
                onFontSizeChange={(id, increase) => {
                  setTextBoxes((prev) =>
                    prev.map((b) =>
                      b.id === id
                        ? {
                            ...b,
                            fontSize: Math.max(
                              12,
                              b.fontSize + (increase ? 2 : -2)
                            ),
                          }
                        : b
                    )
                  );
                }}
                onColorChange={(id, color) => {
                  setTextBoxes((prev) =>
                    prev.map((b) => (b.id === id ? { ...b, color } : b))
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stage2;
