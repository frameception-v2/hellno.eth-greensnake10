"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import type { CanvasHandle } from "~/components/GameCanvas";
import TouchOverlay from "~/components/TouchOverlay";
import { InputHandler } from "~/lib/InputHandler";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";
import GameCanvas from "~/components/GameCanvas";
import { Toast } from "~/components/ui/toast";


export default function Frame() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const { toast } = useToast();
  const [lastCollisionTime, setLastCollisionTime] = useState(0);

  const showCollisionFeedback = useCallback(() => {
    if (Date.now() - lastCollisionTime > 1000) { // Throttle to 1 second
      toast({
        title: "Collision!",
        variant: "destructive",
        duration: 500,
      });
      setLastCollisionTime(Date.now());
    }
  }, [toast, lastCollisionTime]);

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");
  const inputHandlerRef = useRef<InputHandler | null>(null);

  useEffect(() => {
    inputHandlerRef.current = new InputHandler();
    return () => {
      inputHandlerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (inputHandlerRef.current) {
      inputHandlerRef.current.isEnabled = !isPaused;
    }
  }, [isPaused]);

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full max-w-[100vw] p-4">
        {/* Aspect ratio container */}
        <div 
          className="relative w-full"
          style={{
            paddingTop: '100%', // Creates 1:1 aspect ratio
            maxWidth: 'min(100vh, 100vw)', // Ensure square bounds
          }}
        >
          {/* Actual game content */}
          <div className="absolute inset-0 flex flex-col game-container">
            <GameCanvas onCollision={showCollisionFeedback}>
              <GameMenu 
                isPaused={isPaused}
                onPauseResume={() => setIsPaused(!isPaused)}
                onRestart={() => {
                  canvasRef.current?.resetGame();
                  setIsPaused(false);
                }}
              />
              <ScoreDisplay score={0} />
              <TouchOverlay 
                onSwipe={(direction) => {
                  if (inputHandlerRef.current) {
                    inputHandlerRef.current.currentDirection = direction;
                  }
                }}
                className="bg-transparent"
              />
            </GameCanvas>
          </div>
        </div>
      </div>
    </div>
  );
}
