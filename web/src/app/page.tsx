import ImagePortrait from "@/components/ImagePortrait";
import JoinGameButton from "@/components/JoinGameButton";
import Particles from "@/components/Particles";
import RulesButton from "@/components/RulesButton";
import StartGameButton from "@/components/StartGameButton";
import { Characters } from "@/components/utils/characters";

export default function Home() {
  const characterPortraits = Characters.flatMap((character, index, array) => {
    // Determine if the current character is in the middle of the array
    const isMiddle = index === Math.floor((array.length - 1) / 2);

    // Use flatMap to add the extra image when the condition is met
    return [
      <ImagePortrait
        key={character.id}
        title={character.name}
        image={character.image["Classic"]}
      />,
      ...(isMiddle
        ? [
            <ImagePortrait
              key={`${character.id}-logo`}
              title="Clue-Less"
              image="/logo.webp"
            />,
          ]
        : []),
    ];
  });

  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center">
          <Particles
            className="absolute inset-0 pointer-events-none"
            quantity={50}
          />

          <div className="relative">
            <h1 className="inline-flex font-extrabold text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">
              Clue-Less
            </h1>
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg font-semibold text-slate-400">
                Just like the game...but less!
              </p>
            </div>
            <div className="inline-flex justify-center space-x-4">
              <StartGameButton />
              <JoinGameButton />
              <RulesButton />
            </div>
            <div className="flex justify-center m-10 space-x-4">
              {characterPortraits}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
