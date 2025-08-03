"use client";

import { useEffect, useState } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/ethers";
import { Abi, Address } from "viem";

interface Template {
  creator: string;
  endTime: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  totalStaked: bigint;
  isActive: boolean;
  metadata: string;
  image: string;
  timeLeft: number;
}

const TemplateGallery = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  const { data: marketCount } = useReadContract({
    address: DEPLOYED_CONTRACT,
    abi: CONTRACT_ABI,
    functionName: "marketCount",
    args: [],
  });

  const contracts = Array(Number(marketCount) || 0)
    .fill(0)
    .map(
      (_, index) =>
        ({
          address: DEPLOYED_CONTRACT as Address,
          abi: CONTRACT_ABI as Abi,
          functionName: "getMarket",
          args: [BigInt(index)],
        } as const)
    );

  const { data: memeTemplates } = useReadContracts({
    contracts: contracts as readonly unknown[],
  });

  useEffect(() => {
    const loadTemplates = async () => {
      if (!memeTemplates) return;

      const loadedTemplates = await Promise.all(
        memeTemplates.map(async (temp) => {
          const [
            creator,
            endTime,
            yesVotes,
            noVotes,
            totalStaked,
            isActive,
            metadata,
          ] = temp.result as [
            string,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            string
          ];

          const data = await fetch(
            `https://gateway.lighthouse.storage/ipfs/${metadata}`
          );
          const img = await data.text();

          return {
            creator,
            endTime,
            yesVotes,
            noVotes,
            totalStaked,
            isActive,
            metadata,
            image: `data:image/png;base64,${img}`,
            timeLeft: Number(endTime) - Math.floor(Date.now() / 1000),
          };
        })
      );

      setTemplates(loadedTemplates);
    };

    loadTemplates();
  }, [memeTemplates]);

  const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "Ended";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Template settlements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="aspect-square relative">
                <img
                  src={template.image}
                  alt={`Template ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">
                      {Number(template.yesVotes)} Funny
                    </span>
                    <span className="text-red-400">
                      {Number(template.noVotes)} Fud
                    </span>
                  </div>
                  <div className="text-gray-300">
                    {formatTimeLeft(template.timeLeft)}
                  </div>
                </div>
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${
                        (Number(template.yesVotes) /
                          (Number(template.yesVotes) +
                            Number(template.noVotes))) *
                          100 || 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
