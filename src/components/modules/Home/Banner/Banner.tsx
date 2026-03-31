"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Banner } from "@/types/banner.types"
import bannersData from "@/data/banner.json";

export default function CarouselPlugin() {
  const banners = bannersData as Banner[]
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  // MAIN banners
  const mainBanners = banners
    .filter((b) => b.position === "MAIN" && b.isActive)
    .sort((a, b) => a.positionOrder - b.positionOrder)

  // RIGHT banners
  const topBanner = banners.find(
    (b) => b.position === "SECOND" && b.isActive
  )

  const bottomBanner = banners.find(
    (b) => b.position === "THIRD" && b.isActive
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">

      {/* MAIN CAROUSEL */}
      <div className="lg:col-span-3">
        <Carousel
          plugins={[plugin.current]}
          className="w-full overflow-hidden rounded-xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-[360px] sm:h-[450px] md:h-[520px] lg:h-[560px]">

            {mainBanners.map((banner) => (
              <CarouselItem
                key={banner.id}
                className="relative rounded-xl overflow-hidden"
              >
                {/* Image */}
                <Image
                  src={banner.image}
                  alt={banner.altText || banner.title}
                  fill
                  priority
                  className="object-cover rounded-xl"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-xl" />

                {/* Content container */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl ml-8 md:ml-16 p-6 md:p-8 rounded-md text-white">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
                      {banner.title}
                    </h2>

                    <p className="text-sm md:text-base opacity-90 font-extrabold mb-1">
                      {banner.description}
                    </p>

                    <p className="text-xs md:text-xs opacity-95 font-extrabold mb-6">
                      {banner.altText}
                    </p>

                    {banner.buttonText && (
                      <Link href={banner.redirectUrl || "#"}>
                        <Button className="bg-white text-black hover:text-white rounded-md">
                          {banner.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

              </CarouselItem>
            ))}

          </CarouselContent>
        </Carousel>
      </div>

      {/* RIGHT SIDE BANNERS */}
      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-col gap-2">

        {/* TOP BANNER */}
        {topBanner && (
          <Link
            href={topBanner.redirectUrl || "#"}
            className="relative h-[275px] rounded-xl overflow-hidden w-full"
          >
            <Image
              src={topBanner.image}
              alt={topBanner.altText || topBanner.title}
              fill
              className="object-cover rounded-xl"
            />

            <div className="absolute inset-0 bg-black/40 flex items-end p-4 rounded-xl">
              <p className="text-white font-semibold text-lg">
                {topBanner.title}
              </p>
            </div>
          </Link>
        )}

        {/* BOTTOM BANNER */}
        {bottomBanner && (
          <Link
            href={bottomBanner.redirectUrl || "#"}
            className="relative h-[275px] lg:h-[277px] rounded-xl overflow-hidden w-full"
          >
            <Image
              src={bottomBanner.image}
              alt={bottomBanner.altText || bottomBanner.title}
              fill
              className="object-cover rounded-xl"
            />

            <div className="absolute inset-0 bg-black/40 flex items-end p-4 rounded-xl">
              <p className="text-white font-semibold text-lg">
                {bottomBanner.title}
              </p>
            </div>
          </Link>
        )}

      </div>

    </div>
  )
}