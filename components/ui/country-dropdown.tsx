"use client";
import React, { useCallback, useState, forwardRef, useEffect } from "react";

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// utils
import { cn } from "@/lib/utils";

// assets
import { ChevronDown, CheckIcon, Globe } from "lucide-react";
import { CircleFlag } from "react-circle-flags";

// data
import { countries } from "country-data-list";

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country: Country) =>
        country.emoji && country.status !== "deleted" && country.ioc !== "PRK"
    ),
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );

  // Use useRef to track the previous defaultValue
  const prevDefaultValueRef = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only update selectedCountry if defaultValue actually changed
    if (defaultValue !== prevDefaultValueRef.current) {
      prevDefaultValueRef.current = defaultValue;

      if (defaultValue) {
        const initialCountry = options.find(
          (country) => country.alpha3 === defaultValue
        );
        if (initialCountry) {
          setSelectedCountry(initialCountry);
        }
      } else {
        // Only reset if defaultValue is explicitly set to null/undefined
        // Don't reset on initial render when defaultValue is undefined
        if (prevDefaultValueRef.current !== undefined) {
          setSelectedCountry(undefined);
        }
      }
    }
  }, [defaultValue, options]);

  const handleSelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange]
  );

  const triggerClasses = cn(
    "flex min-h-10 h-auto justify-center group w-full lg:w-[180px] rounded-none bg-[#181818] cursor-pointer transition-all duration-400 items-start justify-between whitespace-nowrap border-none outline-none px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20"
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        <div
          className={cn(
            selectedCountry && "flex flex-1 flex-col h-auto self-center w-full"
          )}
        >
          <label
            className={`text-white self-start cursor-pointer ${
              selectedCountry && "text-[12px] "
            } transition-all duration-400 group-hover:text-blue-800`}
          >
            {placeholder}
          </label>
          {selectedCountry ? (
            <div className="flex mt-2 flex-grow w-32 gap-2 overflow-hidden self-start">
              <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                {selectedCountry.name === "All" ? (
                  <Globe size={20} />
                ) : (
                  <CircleFlag
                    countryCode={selectedCountry.alpha2.toLowerCase()}
                    height={20}
                  />
                )}
              </div>
              {slim === false && (
                <span className="overflow-hidden transition-all duration-400 text-ellipsis whitespace-nowrap">
                  {selectedCountry.name}
                </span>
              )}
            </div>
          ) : (
            // <span>{slim === false ? placeholder : <Globe size={20} />}</span>
            slim && <Globe size={20} />
          )}
        </div>
        <ChevronDown
          className="transition-all duration-400 self-center opacity-50 group-hover:text-blue-800 group-hover:opacity-100"
          size={16}
        />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] border-none md:ml-28 p-0 rounded-none bg-[#181818]"
      >
        <Command className="w-full bg-[#181818] max-h-[200px] sm:max-h-[270px] rounded-none">
          <CommandList className="text-white">
            <div className="sticky top-0 z-10 bg-[#181818]  rounded-none">
              <CommandInput className="text-white" placeholder="Search country..." />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="bg-[#181818] border-none  rounded-none">
              <CommandItem
                className="flex items-center w-full gap-2"
                key={"all"}
                onSelect={() =>
                  handleSelect({
                    alpha2: "all",
                    alpha3: "all",
                    countryCallingCodes: [],
                    currencies: [],
                    emoji: undefined,
                    ioc: "",
                    languages: [],
                    name: "All",
                    status: "active",
                  })
                }
              >
                <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
                  <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                    <Globe size={20} />
                  </div>
                  <span
                    className={`overflow-hidden ${
                      "all" === selectedCountry?.name
                        ? "text-blue-800 font-bold"
                        : "text-white"
                    } group-hover:text-blue-800 group-hover:font-bold text-ellipsis whitespace-nowrap`}
                  >
                    All
                  </span>
                </div>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0",
                    "all" === selectedCountry?.name
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className="flex items-center w-full gap-2"
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={option.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span
                        className={`overflow-hidden ${
                          option.name === selectedCountry?.name
                            ? "text-blue-800 font-bold"
                            : "text-white"
                        } group-hover:text-blue-800 group-hover:font-bold text-ellipsis whitespace-nowrap`}
                      >
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        option.name === selectedCountry?.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

const CountryDropdown = forwardRef(CountryDropdownComponent);

export default CountryDropdown;
