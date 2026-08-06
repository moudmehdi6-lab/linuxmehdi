export type GlossaryCategory =
  | "Streaming & Delivery"
  | "Codecs & Compression"
  | "Picture & Audio Quality"
  | "Networking"
  | "IPTV Concepts";

export type GlossaryTerm = {
  slug: string;
  term: string;
  category: GlossaryCategory;
  /** One or two sentences — used as the card summary and meta description. */
  shortDefinition: string;
  /** Fuller explanation, 2-3 short HTML paragraphs. */
  content: string;
  /** Slug of a full-length blog post covering this topic in depth, if one exists. */
  relatedArticleSlug?: string;
  /** Slugs of other glossary terms worth cross-linking. */
  relatedTermSlugs?: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  // ---------- Streaming & Delivery ----------
  {
    slug: "adaptive-bitrate-streaming",
    term: "Adaptive Bitrate Streaming (ABR)",
    category: "Streaming & Delivery",
    shortDefinition:
      "A technique where a player app automatically adjusts video quality in real time to match your available bandwidth.",
    content:
      "<p>Adaptive bitrate streaming is the algorithm behind smooth playback on a fluctuating connection. Content is encoded at several quality levels in advance, and the player continuously estimates your available bandwidth and buffer health to pick the best level at any given moment, stepping down gracefully during a network dip rather than freezing.</p><p>This is why a stream can briefly look softer during a busy network moment instead of stopping outright — the player is deliberately trading resolution for continuity.</p>",
    relatedArticleSlug: "adaptive-bitrate-streaming-explained",
    relatedTermSlugs: ["hls", "bitrate", "buffering"],
  },
  {
    slug: "hls",
    term: "HLS (HTTP Live Streaming)",
    category: "Streaming & Delivery",
    shortDefinition:
      "A widely supported streaming protocol, developed by Apple, that delivers video as small HTTP-downloaded segments described by an M3U8 manifest.",
    content:
      "<p>HLS breaks video into short segments — typically a few seconds each — and lists them in a plain-text manifest file. Because it rides on standard HTTP, it passes through firewalls and web infrastructure without special configuration, which is a major reason it became the dominant streaming protocol across IPTV, OTT platforms, and general web video alike.</p><p>Most IPTV playlists and channel streams you use today are delivered over HLS, even if you never see the protocol name directly.</p>",
    relatedArticleSlug: "hls-explained",
    relatedTermSlugs: ["mpeg-dash", "m3u8", "adaptive-bitrate-streaming"],
  },
  {
    slug: "mpeg-dash",
    term: "MPEG-DASH",
    category: "Streaming & Delivery",
    shortDefinition:
      "A format-agnostic adaptive streaming standard similar to HLS, not tied to any single company or codec.",
    content:
      "<p>MPEG-DASH follows the same segment-and-manifest approach as HLS but was developed as an open, vendor-neutral standard rather than originating from a single company. It's codec-agnostic, meaning it can carry H.264, H.265, or AV1 content equally well, and it's common on many web-based streaming platforms and browsers.</p><p>For most viewers, the practical difference between HLS and DASH is invisible — your player app and provider negotiate which one to use automatically.</p>",
    relatedArticleSlug: "mpeg-dash-explained",
    relatedTermSlugs: ["hls", "codec"],
  },
  {
    slug: "cdn",
    term: "CDN (Content Delivery Network)",
    category: "Streaming & Delivery",
    shortDefinition:
      "A geographically distributed network of servers that deliver content from a location near you, rather than one central server.",
    content:
      "<p>Instead of every viewer's request traveling to one distant data center, a CDN serves it from a nearby \"edge\" server, cutting down distance and delay. This is a major reason a stream starts almost instantly regardless of where you're physically located, and why streaming providers with strong CDN infrastructure tend to perform more consistently across regions.</p>",
    relatedArticleSlug: "cdn-explained",
    relatedTermSlugs: ["latency", "throughput", "bandwidth"],
  },
  {
    slug: "manifest-file",
    term: "Manifest File",
    category: "Streaming & Delivery",
    shortDefinition:
      "A small text file listing a stream's available quality levels and where to find each one's video segments.",
    content:
      "<p>A manifest is the map your player app reads before it downloads any actual video. In HLS, this is the M3U8 file; in MPEG-DASH, it's an MPD file. Either way, the manifest describes what quality levels exist and points to the segment files for each, letting the player make an informed adaptive bitrate decision before a single frame is downloaded.</p>",
    relatedTermSlugs: ["hls", "m3u8", "segment"],
  },
  {
    slug: "segment",
    term: "Segment (Video Segment)",
    category: "Streaming & Delivery",
    shortDefinition:
      "A short chunk of video, typically 2-10 seconds long, that adaptive streaming protocols download and play one after another.",
    content:
      "<p>Rather than downloading an entire video file before playback, HLS and MPEG-DASH split content into small segments that are requested continuously as you watch. This segmented approach is what makes adaptive bitrate switching possible — the player can change quality level at the next segment boundary without interrupting playback.</p>",
    relatedTermSlugs: ["hls", "keyframe", "adaptive-bitrate-streaming"],
  },
  {
    slug: "buffering",
    term: "Buffering",
    category: "Streaming & Delivery",
    shortDefinition:
      "The process of downloading video data ahead of your current playback position, held in reserve to absorb brief network interruptions.",
    content:
      "<p>A healthy buffer is what lets a stream survive a momentary network hiccup without visibly pausing — the player draws from the buffered reserve while it waits for the connection to catch up. The visible \"buffering\" spinner appears specifically when that reserve runs dry faster than new data arrives.</p><p>Buffer size involves a genuine trade-off: a larger buffer improves resilience to network dips but slows down how quickly playback starts.</p>",
    relatedArticleSlug: "streaming-buffer-size-explained",
    relatedTermSlugs: ["latency", "adaptive-bitrate-streaming"],
  },
  {
    slug: "latency",
    term: "Latency",
    category: "Streaming & Delivery",
    shortDefinition:
      "The time it takes for a small piece of data to travel from your device to a server and back, usually measured in milliseconds.",
    content:
      "<p>Latency is different from bandwidth — a connection can move a lot of data per second while still having a slow round-trip response time. For streaming specifically, latency contributes to the small delay between a live event happening and it appearing on your screen, though it matters less for playback smoothness than raw bandwidth and connection stability do.</p>",
    relatedArticleSlug: "reduce-network-latency",
    relatedTermSlugs: ["jitter", "throughput", "buffering"],
  },
  {
    slug: "jitter",
    term: "Jitter",
    category: "Streaming & Delivery",
    shortDefinition:
      "Variation in latency over time — how inconsistent the delay between data packets is, rather than the delay itself.",
    content:
      "<p>Two connections can have the same average latency yet feel very different if one is far more variable than the other. High jitter disrupts the steady, predictable delivery adaptive streaming relies on, which is why a connection with fluctuating response times can produce more stutter than a slightly slower but more consistent one.</p>",
    relatedTermSlugs: ["latency", "buffering"],
  },
  {
    slug: "multicast",
    term: "Multicast",
    category: "Streaming & Delivery",
    shortDefinition:
      "A delivery method where one shared signal is sent to many viewers simultaneously, closer to traditional broadcast.",
    content:
      "<p>Multicast is efficient for a managed network sending identical content to many subscribers at once, since the network only carries one copy of the stream rather than a separate copy per viewer. It's more common in telecom-operated IPTV networks than in independent, internet-delivered IPTV, which almost universally uses unicast instead.</p>",
    relatedTermSlugs: ["unicast", "iptv"],
  },
  {
    slug: "unicast",
    term: "Unicast",
    category: "Streaming & Delivery",
    shortDefinition:
      "A delivery method where each viewer gets their own individual, separate stream connection to the server.",
    content:
      "<p>Unicast is what almost all consumer IPTV and OTT streaming uses today. Because each viewer has an independent connection, features like pausing, seeking, and adaptive bitrate switching work individually per person — unlike multicast, where everyone shares one identical signal.</p>",
    relatedTermSlugs: ["multicast", "iptv"],
  },
  {
    slug: "transcoding",
    term: "Transcoding",
    category: "Streaming & Delivery",
    shortDefinition:
      "Converting video from one format, codec, or bitrate to another, often to produce multiple quality levels for adaptive streaming.",
    content:
      "<p>A provider transcodes a source video into several quality tiers — say, 1080p, 720p, and 480p versions — so a player app can select whichever one fits the current connection. Transcoding happens on the server side, using significant processing power, well before any content reaches your device.</p>",
    relatedTermSlugs: ["codec", "adaptive-bitrate-streaming", "video-compression"],
  },

  // ---------- Codecs & Compression ----------
  {
    slug: "codec",
    term: "Codec",
    category: "Codecs & Compression",
    shortDefinition:
      "The specific algorithm used to compress and decompress video or audio, such as H.264, H.265, or AV1.",
    content:
      "<p>A codec defines the rules for shrinking raw video into a manageable file size and reconstructing it for playback. Different codecs offer different trade-offs between compression efficiency, licensing cost, and how broadly devices support decoding them in hardware. Codec is often confused with container format, which is a separate concept describing how compressed data is packaged into a file.</p>",
    relatedArticleSlug: "video-compression-guide",
    relatedTermSlugs: ["h264", "h265-hevc", "av1", "container-format"],
  },
  {
    slug: "h264",
    term: "H.264 (AVC)",
    category: "Codecs & Compression",
    shortDefinition:
      "The most widely compatible video codec in use today, offering broad device support at the cost of less efficient compression than newer codecs.",
    content:
      "<p>H.264 has been the default streaming codec for over a decade, supported by essentially every device with hardware decoding capability. Newer codecs like H.265 and AV1 compress more efficiently, but H.264's near-universal compatibility is why it remains common for IPTV channels prioritizing broad reach over maximum efficiency.</p>",
    relatedArticleSlug: "h264-vs-h265",
    relatedTermSlugs: ["h265-hevc", "codec"],
  },
  {
    slug: "h265-hevc",
    term: "H.265 / HEVC",
    category: "Codecs & Compression",
    shortDefinition:
      "A more efficient successor to H.264, delivering comparable quality at roughly 40-50% smaller file sizes, at the cost of licensing fees.",
    content:
      "<p>HEVC (High Efficiency Video Coding) is common for 4K IPTV content specifically, since its improved compression makes higher resolutions more bandwidth-practical. Its main trade-off against the royalty-free AV1 codec is licensing cost, though HEVC currently has broader hardware decoding support across devices.</p>",
    relatedArticleSlug: "hevc-vs-av1",
    relatedTermSlugs: ["h264", "av1"],
  },
  {
    slug: "av1",
    term: "AV1",
    category: "Codecs & Compression",
    shortDefinition:
      "A royalty-free, open-source video codec generally offering better compression than HEVC, backed by major streaming and tech companies.",
    content:
      "<p>AV1 was developed by the Alliance for Open Media specifically to avoid the licensing costs associated with HEVC. It typically compresses more efficiently, but device hardware decoding support remains less universal than H.264 or HEVC, particularly on older or budget hardware.</p>",
    relatedArticleSlug: "av1-codec-explained",
    relatedTermSlugs: ["h265-hevc", "codec"],
  },
  {
    slug: "video-compression",
    term: "Video Compression",
    category: "Codecs & Compression",
    shortDefinition:
      "The process of reducing video file size by removing redundant information, using both spatial and temporal techniques.",
    content:
      "<p>Raw, uncompressed video is far too large to stream practically. Compression exploits the fact that consecutive frames are often very similar (temporal redundancy) and that a single frame often contains repeated patterns (spatial redundancy), storing only what's genuinely new rather than every pixel of every frame in full.</p>",
    relatedArticleSlug: "video-compression-guide",
    relatedTermSlugs: ["codec", "lossy-compression"],
  },
  {
    slug: "container-format",
    term: "Container Format",
    category: "Codecs & Compression",
    shortDefinition:
      "The file format (like MP4 or MKV) that wraps compressed video, audio, subtitles, and metadata together — distinct from the codec itself.",
    content:
      "<p>A container is a box, not a compression method — MP4 and MKV can both hold identical H.264 video, for instance. MP4 offers broader device compatibility, while MKV supports more flexible multi-track audio and subtitle configurations, which is why it's popular for archiving.</p>",
    relatedArticleSlug: "mkv-vs-mp4",
    relatedTermSlugs: ["codec"],
  },
  {
    slug: "lossy-compression",
    term: "Lossy Compression",
    category: "Codecs & Compression",
    shortDefinition:
      "Compression that permanently discards some detail the human eye is less likely to notice, in exchange for dramatically smaller file sizes.",
    content:
      "<p>Virtually all streaming video uses lossy compression rather than lossless (like a ZIP file), since lossless methods achieve far smaller size reductions — impractical for real-time delivery over typical home connections. Modern codecs are designed to minimize visible quality loss at reasonable bitrates.</p>",
    relatedTermSlugs: ["video-compression", "codec"],
  },
  {
    slug: "aac",
    term: "AAC (Advanced Audio Coding)",
    category: "Codecs & Compression",
    shortDefinition:
      "The most broadly compatible audio codec in streaming, offering efficient compression with near-universal device support.",
    content:
      "<p>AAC is the safe, default audio codec most streaming platforms rely on for stereo and basic multi-channel audio. It's used across most IPTV channels, YouTube, and countless other services thanks to its consistent hardware decoding support.</p>",
    relatedArticleSlug: "audio-codecs-explained",
    relatedTermSlugs: ["ac3-dolby-digital", "eac3-dolby-digital-plus"],
  },
  {
    slug: "ac3-dolby-digital",
    term: "AC3 (Dolby Digital)",
    category: "Codecs & Compression",
    shortDefinition:
      "A long-established surround sound audio codec supporting up to 5.1 channels, common in live broadcast and IPTV feeds.",
    content:
      "<p>AC3 has been a broadcast and home theater standard for decades, which is why it remains extremely common in live TV and IPTV specifically — many channels originate from broadcast feeds already using it. It requires a compatible receiver or soundbar for full surround decoding.</p>",
    relatedArticleSlug: "audio-codecs-explained",
    relatedTermSlugs: ["eac3-dolby-digital-plus", "aac"],
  },
  {
    slug: "eac3-dolby-digital-plus",
    term: "EAC3 (Dolby Digital Plus)",
    category: "Codecs & Compression",
    shortDefinition:
      "A more efficient successor to AC3, supporting more audio channels at a lower bitrate for comparable surround sound quality.",
    content:
      "<p>Enhanced AC3 improves on the original with better compression and support for up to 7.1 channels and beyond. It's increasingly the default for platforms wanting surround sound without AC3's larger bandwidth footprint, and it's required for passing through certain advanced audio formats.</p>",
    relatedArticleSlug: "audio-codecs-explained",
    relatedTermSlugs: ["ac3-dolby-digital", "aac"],
  },

  // ---------- Picture & Audio Quality ----------
  {
    slug: "hdr",
    term: "HDR (High Dynamic Range)",
    category: "Picture & Audio Quality",
    shortDefinition:
      "A display technology that expands the range of brightness and color a screen can show, producing more realistic highlights and shadow detail.",
    content:
      "<p>HDR content carries additional metadata describing how bright and colorful specific parts of the image should be, which a compatible display uses to render a more lifelike picture than standard dynamic range. Several competing HDR formats exist, including HDR10, HDR10+, and Dolby Vision, each handling this metadata slightly differently.</p>",
    relatedArticleSlug: "hdr10-vs-dolby-vision",
    relatedTermSlugs: ["hdr10", "dolby-vision", "resolution"],
  },
  {
    slug: "hdr10",
    term: "HDR10",
    category: "Picture & Audio Quality",
    shortDefinition:
      "The baseline, royalty-free HDR standard supported on nearly every HDR-capable display, using one fixed brightness setting for an entire piece of content.",
    content:
      "<p>HDR10 uses \"static metadata\" — one brightness and color calibration applied across an entire movie or show, rather than adjusting scene by scene. It's the most universally supported HDR format today, making it the safe baseline even as newer dynamic-metadata formats like HDR10+ and Dolby Vision gain adoption.</p>",
    relatedArticleSlug: "hdr10-vs-dolby-vision",
    relatedTermSlugs: ["hdr", "dolby-vision"],
  },
  {
    slug: "dolby-vision",
    term: "Dolby Vision",
    category: "Picture & Audio Quality",
    shortDefinition:
      "A premium, licensed HDR format using dynamic, scene-by-scene metadata and a Dolby-certified quality control process.",
    content:
      "<p>Unlike the royalty-free HDR10 and HDR10+, Dolby Vision is a proprietary format that requires manufacturer licensing. It supports higher metadata precision and Dolby's own certification process across the mastering and device ecosystem, which is part of why it carries a reputation for consistent picture quality.</p>",
    relatedArticleSlug: "dolby-vision-explained",
    relatedTermSlugs: ["hdr10", "hdr"],
  },
  {
    slug: "resolution",
    term: "Resolution",
    category: "Picture & Audio Quality",
    shortDefinition:
      "The number of pixels that make up a video frame, commonly expressed as width by height (like 1920x1080 for 1080p).",
    content:
      "<p>Higher resolution means more visual detail, but only up to what a compressed stream's bitrate can actually support — a poorly compressed 4K stream can look worse than a well-compressed 1080p one. Resolution and compression quality are related but genuinely separate factors in overall picture quality.</p>",
    relatedArticleSlug: "1080p-vs-4k",
    relatedTermSlugs: ["4k-uhd", "8k", "bitrate"],
  },
  {
    slug: "4k-uhd",
    term: "4K / UHD",
    category: "Picture & Audio Quality",
    shortDefinition:
      "A resolution of roughly 3,840 by 2,160 pixels, offering four times the detail of standard 1080p Full HD.",
    content:
      "<p>4K (Ultra High Definition) has become the practical high-end standard for streaming, requiring around 25+ Mbps for a smooth IPTV stream. It offers a genuinely noticeable improvement over 1080p at typical viewing distances on a reasonably sized screen.</p>",
    relatedArticleSlug: "1080p-vs-4k",
    relatedTermSlugs: ["resolution", "8k"],
  },
  {
    slug: "8k",
    term: "8K",
    category: "Picture & Audio Quality",
    shortDefinition:
      "A resolution of roughly 7,680 by 4,320 pixels — sixteen times the pixel count of 1080p — with very limited practical streaming content today.",
    content:
      "<p>8K remains ahead of both typical home bandwidth capability and available native content for streaming, including IPTV. Most \"8K TV\" benefit today comes from upscaling existing lower-resolution content rather than genuine native 8K programming.</p>",
    relatedArticleSlug: "8k-streaming-explained",
    relatedTermSlugs: ["4k-uhd", "resolution"],
  },
  {
    slug: "refresh-rate",
    term: "Refresh Rate",
    category: "Picture & Audio Quality",
    shortDefinition:
      "How many times per second a display updates its image, measured in Hertz (Hz) — commonly 60Hz, with 120Hz on newer gaming-focused hardware.",
    content:
      "<p>For standard IPTV streaming, content delivered at 24, 30, or 60 frames per second doesn't require the higher 120Hz refresh rates that features like HDMI 2.1's VRR specifically target — those matter much more for gaming than for typical live channel or on-demand viewing.</p>",
    relatedArticleSlug: "hdmi-2-1-explained",
    relatedTermSlugs: ["resolution"],
  },
  {
    slug: "bitrate",
    term: "Bitrate",
    category: "Picture & Audio Quality",
    shortDefinition:
      "The amount of data used per second of video or audio, directly affecting both quality and bandwidth requirements.",
    content:
      "<p>Higher bitrate generally means better quality at a given resolution, up to a point of diminishing returns. Bitrate and resolution are independent settings — a provider can deliver 4K at a bitrate too low to look genuinely sharp, which is why the resolution number alone doesn't guarantee quality.</p>",
    relatedArticleSlug: "streaming-bitrate-guide",
    relatedTermSlugs: ["resolution", "codec"],
  },
  {
    slug: "keyframe",
    term: "Keyframe (I-frame)",
    category: "Picture & Audio Quality",
    shortDefinition:
      "A complete, independently decodable video frame used as a reference point, as opposed to frames that only store changes since the last one.",
    content:
      "<p>Keyframes let a player start decoding at any point — necessary for seeking, joining a live stream mid-broadcast, or recovering after a dropped connection. Frames between keyframes are much smaller since they only encode what changed, but depend on the preceding keyframe to decode correctly.</p>",
    relatedTermSlugs: ["segment", "codec"],
  },

  // ---------- Networking ----------
  {
    slug: "qos",
    term: "QoS (Quality of Service)",
    category: "Networking",
    shortDefinition:
      "A router feature that prioritizes certain devices or traffic types, ensuring streaming devices get bandwidth first during network congestion.",
    content:
      "<p>Without QoS, a large download on one device can starve a streaming device of bandwidth at exactly the wrong moment. Enabling QoS and prioritizing your streaming devices is consistently one of the highest-impact router settings for reducing contention-driven buffering in a busy household.</p>",
    relatedArticleSlug: "best-router-settings-for-streaming",
    relatedTermSlugs: ["bandwidth", "throughput"],
  },
  {
    slug: "mesh-wifi",
    term: "Mesh Wi-Fi",
    category: "Networking",
    shortDefinition:
      "A system of multiple coordinated Wi-Fi nodes that provide more even coverage across a home than a single router alone.",
    content:
      "<p>Mesh nodes work together, handing your device off seamlessly as you move between their coverage areas, unlike a basic extender that simply repeats a signal. Mesh is most valuable in larger or multi-floor homes with genuine dead zones — smaller homes are often well served by a single capable router.</p>",
    relatedArticleSlug: "mesh-wifi-guide",
    relatedTermSlugs: ["qos", "wifi-6"],
  },
  {
    slug: "wifi-6",
    term: "Wi-Fi 6 (802.11ax)",
    category: "Networking",
    shortDefinition:
      "A Wi-Fi standard focused on efficiency in crowded, multi-device environments, rather than just raw peak speed.",
    content:
      "<p>Wi-Fi 6 introduced technology that lets a router serve multiple devices more efficiently within the same transmission window. For most streaming households, it comfortably covers IPTV's modest bandwidth needs, making it a strong, cost-effective baseline even as newer standards like Wi-Fi 7 emerge.</p>",
    relatedArticleSlug: "wifi-6-vs-wifi-7",
    relatedTermSlugs: ["mesh-wifi", "bandwidth"],
  },
  {
    slug: "ethernet",
    term: "Ethernet",
    category: "Networking",
    shortDefinition:
      "A wired networking standard that connects a device directly to a router via cable, offering more consistent performance than Wi-Fi.",
    content:
      "<p>A wired connection removes Wi-Fi's variability — interference, distance, and signal congestion — entirely. For a primary streaming device, wiring it via Ethernet is consistently one of the most effective upgrades available, often outperforming even a Wi-Fi standard upgrade.</p>",
    relatedArticleSlug: "ethernet-vs-wifi",
    relatedTermSlugs: ["mesh-wifi", "latency"],
  },
  {
    slug: "dns",
    term: "DNS (Domain Name System)",
    category: "Networking",
    shortDefinition:
      "The system that translates human-readable domain names into the numeric IP addresses computers actually use to connect.",
    content:
      "<p>Every time your device connects to a streaming server, DNS resolves that server's address first. Switching from your ISP's default DNS to a fast public provider can shave a small amount of time off initial connections, though it has no effect on your actual streaming bandwidth.</p>",
    relatedTermSlugs: ["vpn", "qos"],
  },
  {
    slug: "vpn",
    term: "VPN (Virtual Private Network)",
    category: "Networking",
    shortDefinition:
      "A service that routes your internet traffic through an encrypted tunnel to an intermediate server, masking your IP address and location.",
    content:
      "<p>A VPN isn't strictly required for most IPTV use, though some subscribers use one for added privacy on public networks. It typically adds some latency, since traffic takes a longer path through the VPN server, which can occasionally affect streaming performance.</p>",
    relatedArticleSlug: "do-you-need-a-vpn-for-iptv",
    relatedTermSlugs: ["latency", "dns"],
  },
  {
    slug: "mtu",
    term: "MTU (Maximum Transmission Unit)",
    category: "Networking",
    shortDefinition:
      "The largest packet size a network connection sends in a single transmission, typically 1500 bytes on most home connections.",
    content:
      "<p>An incorrectly configured MTU, more common on certain fiber and PPPoE-based connections, can cause intermittent stalls or dropped packets. Most connections work fine at the standard default, but matching your ISP's specified value can resolve otherwise puzzling connectivity issues.</p>",
    relatedTermSlugs: ["qos", "bandwidth"],
  },
  {
    slug: "bandwidth",
    term: "Bandwidth",
    category: "Networking",
    shortDefinition:
      "The maximum amount of data a connection can transfer per second, usually advertised in Mbps (megabits per second) by your ISP.",
    content:
      "<p>Bandwidth is your connection's capacity, not a guarantee of actual achieved speed at any given moment — that's throughput. IPTV streaming needs relatively modest bandwidth (15-50 Mbps depending on quality), well within most modern home internet plans.</p>",
    relatedArticleSlug: "internet-speed-for-streaming",
    relatedTermSlugs: ["throughput", "bitrate"],
  },
  {
    slug: "throughput",
    term: "Throughput",
    category: "Networking",
    shortDefinition:
      "The actual data rate achieved on a connection in practice, as opposed to the theoretical maximum bandwidth advertised by an ISP.",
    content:
      "<p>Real-world throughput is typically somewhat lower than advertised bandwidth due to protocol overhead, network congestion, and distance from infrastructure. Running a proper speed test at your actual viewing time gives a far more accurate picture of throughput than the number on your ISP's plan.</p>",
    relatedArticleSlug: "internet-speed-test-guide",
    relatedTermSlugs: ["bandwidth", "latency"],
  },

  // ---------- IPTV Concepts ----------
  {
    slug: "iptv",
    term: "IPTV (Internet Protocol Television)",
    category: "IPTV Concepts",
    shortDefinition:
      "A method of delivering television content over the internet using standard IP networking, rather than traditional broadcast, cable, or satellite signals.",
    content:
      "<p>IPTV typically refers to a channel-and-playlist-based system where a provider issues a personal playlist URL that a compatible player app uses to build a full channel list. Unlike OTT platforms with their own dedicated apps, IPTV relies on general-purpose player apps that can load any compatible playlist.</p>",
    relatedArticleSlug: "what-is-iptv",
    relatedTermSlugs: ["ott", "m3u-playlist", "unicast"],
  },
  {
    slug: "ott",
    term: "OTT (Over-The-Top)",
    category: "IPTV Concepts",
    shortDefinition:
      "Streaming services, like Netflix or YouTube, delivered directly over the internet through their own dedicated app, bypassing traditional distribution.",
    content:
      "<p>OTT and IPTV both stream over the internet but differ in structure: OTT platforms deliver their own licensed content through a single dedicated app, while IPTV typically aggregates many live channel sources into one playlist usable by any compatible player app.</p>",
    relatedArticleSlug: "iptv-vs-ott",
    relatedTermSlugs: ["iptv"],
  },
  {
    slug: "epg",
    term: "EPG (Electronic Program Guide)",
    category: "IPTV Concepts",
    shortDefinition:
      "The on-screen schedule grid showing what's currently airing and what's coming up next on each channel.",
    content:
      "<p>An EPG is a separate data source from the channel stream itself, usually delivered via a distinct URL in XMLTV format, matched to your playlist through shared channel identifiers. A channel can stream perfectly while its guide data is missing, since the two systems operate independently.</p>",
    relatedArticleSlug: "epg-explained",
    relatedTermSlugs: ["xmltv", "m3u-playlist"],
  },
  {
    slug: "xmltv",
    term: "XMLTV",
    category: "IPTV Concepts",
    shortDefinition:
      "An open, XML-based file format used to describe TV listings — the standard behind most EPG data.",
    content:
      "<p>Each XMLTV entry includes a channel identifier, program title, start and end time, and often a short description. Player apps parse this data and match it to the corresponding channel in your playlist using shared identifiers, which is why mismatched IDs are a common cause of missing guide data.</p>",
    relatedArticleSlug: "xmltv-guide",
    relatedTermSlugs: ["epg"],
  },
  {
    slug: "m3u-playlist",
    term: "M3U Playlist",
    category: "IPTV Concepts",
    shortDefinition:
      "A plain-text file listing channel names and their corresponding stream URLs — the core file that turns a player app into a full channel list.",
    content:
      "<p>An M3U file typically contains embedded access credentials within its URL, which is why it should be treated like a password and never shared publicly. Most modern IPTV playlists specifically use the UTF-8 encoded M3U8 variant, standardized as part of HLS.</p>",
    relatedArticleSlug: "m3u-playlist-explained",
    relatedTermSlugs: ["m3u8", "iptv"],
  },
  {
    slug: "m3u8",
    term: "M3U8",
    category: "IPTV Concepts",
    shortDefinition:
      "The UTF-8 encoded, HLS-standardized variant of the M3U playlist format, reliably supporting international channel names.",
    content:
      "<p>HLS uses a two-tier M3U8 structure: a master playlist listing available quality levels, and media playlists listing the actual video segments for each level. Your player app handles this automatically, requesting and parsing both levels without any manual configuration from you.</p>",
    relatedArticleSlug: "m3u8-explained",
    relatedTermSlugs: ["m3u-playlist", "hls"],
  },
  {
    slug: "simultaneous-streams",
    term: "Simultaneous Streams",
    category: "IPTV Concepts",
    shortDefinition:
      "The number of devices that can play content from one subscription at the same time, as set by a provider's plan.",
    content:
      "<p>The same credentials can typically be installed on any number of devices, but only the plan's specified number can actively stream at once. Exceeding this limit usually causes an older active stream to disconnect when a new one starts, rather than blocking the new connection outright.</p>",
    relatedTermSlugs: ["iptv", "unicast"],
  },
  {
    slug: "catch-up-tv",
    term: "Catch-Up TV",
    category: "IPTV Concepts",
    shortDefinition:
      "A feature letting you rewind a live channel's recent broadcast window, bridging live streaming and true on-demand viewing.",
    content:
      "<p>Technically, catch-up works by retaining recently-aired live segments on the server for a limited time, turning a portion of the live stream into a temporary, time-limited on-demand experience. Once that retention window passes, the content is no longer available, unlike true VOD content kept indefinitely.</p>",
    relatedArticleSlug: "live-streaming-vs-video-on-demand",
    relatedTermSlugs: ["iptv"],
  },
];

export function getGlossaryTermBySlug(slug: string) {
  return glossaryTerms.find((term) => term.slug === slug) ?? null;
}

export function getGlossaryCategories(): GlossaryCategory[] {
  return Array.from(new Set(glossaryTerms.map((t) => t.category)));
}

export function getRelatedGlossaryTerms(term: GlossaryTerm, limit = 4) {
  if (!term.relatedTermSlugs?.length) return [];
  return term.relatedTermSlugs
    .map((slug) => getGlossaryTermBySlug(slug))
    .filter((t): t is GlossaryTerm => t !== null)
    .slice(0, limit);
}
