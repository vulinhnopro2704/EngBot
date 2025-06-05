import { LoadingAnimals } from "@/components/ui/loading-animals"

interface LoadingPracticeOptionsProps {
  animalType: "cat" | "quokka" | "hamster" | "capybara"
}

export function LoadingPracticeOptions({ animalType }: LoadingPracticeOptionsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <LoadingAnimals 
        type={animalType} 
        text="Loading practice options..." 
        size="lg" 
        color="purple" 
      />
    </div>
  )
}
