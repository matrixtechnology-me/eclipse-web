import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

type Props = {
  steps: Array<{
    step: number;
    title: string;
  }>;
  currentStep: number;
}

export default function TitledStepper({
  steps,
  currentStep,
}: Props) {
  return (
    <Stepper
      defaultValue={steps[0]?.step || 1}
      value={currentStep}
    >
      {steps.map(({ step, title }) => (
        <StepperItem
          key={step}
          step={step}
          className="not-last:flex-1 max-md:items-start"
        >
          <StepperTrigger
            className="rounded max-md:flex-col disabled:opacity-100"
            disabled
          >
            <StepperIndicator />
            <div className="text-center md:text-left">
              <StepperTitle>{title}</StepperTitle>
            </div>
          </StepperTrigger>
          {step < steps.length && (
            <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
          )}
        </StepperItem>
      ))}
    </Stepper>
  )
}
