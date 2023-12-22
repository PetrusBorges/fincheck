import { Transition } from "@headlessui/react";

import { Logo } from "./Logo";
import { Spinner } from "./Spinner";

interface LaunchScreenProps {
  isLoading: boolean;
}

export function LaunchScreen({ isLoading }: LaunchScreenProps) {
  return (
    <Transition
      show={isLoading}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="bg-teal-800 fixed w-full h-full top-0 left-0 flex flex-col items-center justify-center gap-5">
        <Logo className="h-10 text-white" />
        <Spinner className="text-teal-800 fill-white" />
      </div>
    </Transition>
  )
}
