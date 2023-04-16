import { ImageResponse } from 'next/server';
import { parse } from 'rss-to-json'

export const size = { width: 1200, height: 600 };
export const alt = 'About this episode of Cashed.dev';
export const contentType = 'image/png';

function randomBetween(min, max, seed = 1) {
    return () => {
        let rand = Math.sin(seed++) * 10000
        rand = rand - Math.floor(rand)
        return Math.floor(rand * (max - min + 1) + min)
    }
}

export function Waveform(props) {
    let id = 'waveform'
    let bars = {
        total: 100,
        width: .4,
        gap: .2,
        minHeight: 40,
        maxHeight: 100,
    }

    let barHeights = Array.from(
        { length: bars.total },
        randomBetween(bars.minHeight, bars.maxHeight)
    )


    return (
        <svg aria-hidden="true" {...props}>
            <defs>
                <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="40%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </linearGradient>
                <linearGradient id={`${id}-gradient`}>
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="50%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
                <mask id={`${id}-mask`}>
                    <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
                </mask>
                <pattern
                    id={`${id}-pattern`}
                    width={bars.total * bars.width + bars.total * bars.gap}
                    height="100%"
                    patternUnits="userSpaceOnUse"
                >
                    {Array.from({ length: bars.total }, (_, index) => (
                        <rect
                            key={index}
                            width={bars.width}
                            height={`${barHeights[index]}%`}
                            x={bars.gap * (index + 1) + bars.width * index}
                            fill={`url(#${id}-fade)`}
                        />
                    ))}
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill={`url(#${id}-gradient)`}
                mask={`url(#${id}-mask)`}
                opacity="0.25"
            />
        </svg>
    )
}

export default async function og(req) {
    const feed = await parse('https://feeds.transistor.fm/cashed-dev');

    const episodes = feed.items.map(
        ({ title, description, enclosures, published }) => ({
            title: `${title}`,
            published,
            description,
            audio: enclosures.map((enclosure) => ({
                src: enclosure.url,
                type: enclosure.type,
            }))[0],
        })
    )


    const title = "Cashed.dev";
    const description = "Weekly conversations about the business of starting a software company."

    const currentEpisode = episodes[0];

    const episodeTitle = currentEpisode.title;

    return new ImageResponse(
        <
            div
            tw="justify-between bg-white"
            style
            =
            {{
                height
                    :

                    '100%'
                ,
                width
                    :

                    '100%'
                ,
                display
                    :

                    'flex'
                ,
            }}

        >
            <img tw="w-[640px]" src={"https://cashed.dev/poster.png"} />

            <div tw="flex w-full flex-1 flex-wrap">
                <Waveform tw="absolute left-0 top-0 h-40 w-full" />
                <h1 tw="ml-4 mt-48 text-5xl font-bold tracking-tight ">
                    {title}
                </h1>
                <h3 tw="mt-4 ml-4 text-lg mr-4">{description}</h3>
                <h1 tw="ml-4 mt-12 text-6xl font-bold tracking-tight">
                    {episodeTitle}
                </h1>
            </div>

        </div >
    );
}