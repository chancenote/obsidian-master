import { YOUTUBE_DATA } from "@/lib/data/youtube";

const COMMUNITY_RESOURCES = [
  {
    title: "Obsidian 공식 포럼",
    desc: "플러그인 소개, 워크플로우 공유, 문제 해결",
    url: "https://forum.obsidian.md",
    label: "forum.obsidian.md",
  },
  {
    title: "r/ObsidianMD (Reddit)",
    desc: "글로벌 옵시디언 커뮤니티. Vault 셋업 공유, 플러그인 추천",
    url: "https://reddit.com/r/ObsidianMD",
    label: "reddit.com/r/ObsidianMD",
  },
  {
    title: "Obsidian Roundup 뉴스레터",
    desc: "매주 옵시디언 업데이트, 새 플러그인, 팁을 정리해주는 뉴스레터",
    url: "https://www.obsidianroundup.org",
    label: "obsidianroundup.org",
  },
  {
    title: "Obsidian Discord",
    desc: "실시간 질의응답, 플러그인 개발자와 소통",
    url: "https://discord.gg/obsidianmd",
    label: "Obsidian Discord",
  },
];

export default function YouTubePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="mb-2 text-xl font-bold text-violet-400">
          옵시디언 YouTube 강의 가이드
        </h1>
        <p className="text-sm text-zinc-500">
          검색 키워드를 클릭하면 YouTube에서 바로 검색할 수 있습니다.
        </p>
      </div>

      {/* Korean sections */}
      {YOUTUBE_DATA.korean.map((section) => (
        <div
          key={section.section}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <h2 className="mb-4 text-lg font-semibold text-violet-400">
            {section.section}{" "}
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              한국어
            </span>
          </h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.search}
                className="rounded-lg border border-zinc-800 p-3 transition-colors hover:border-violet-600"
              >
                <div className="text-sm font-semibold text-zinc-100">
                  {item.title}
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {item.channel}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-zinc-600">
                  {item.desc}
                </div>
                <div className="mt-1.5">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.search)}`}
                    target="_blank"
                    rel="noopener"
                    className="text-xs text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    YouTube에서 검색 &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Community resources */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-lg font-semibold text-violet-400">
          옵시디언 커뮤니티 &amp; 추가 리소스
        </h2>
        <div className="space-y-2">
          {COMMUNITY_RESOURCES.map((resource) => (
            <div
              key={resource.url}
              className="rounded-lg border border-zinc-800 p-3 transition-colors hover:border-violet-600"
            >
              <div className="text-sm font-semibold text-zinc-100">
                {resource.title}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-zinc-600">
                {resource.desc}
              </div>
              <div className="mt-1.5">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-violet-400 hover:text-violet-300 hover:underline"
                >
                  {resource.label} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International sections */}
      {YOUTUBE_DATA.international.map((section) => (
        <div
          key={section.section}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <h2 className="mb-4 text-lg font-semibold text-violet-400">
            {section.section}{" "}
            <span className="rounded bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-400">
              English
            </span>
          </h2>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.search}
                className="rounded-lg border border-zinc-800 p-3 transition-colors hover:border-violet-600"
              >
                <div className="text-sm font-semibold text-zinc-100">
                  {item.title}
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">
                  {item.channel}
                  {item.url ? (
                    <>
                      {" "}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener"
                        className="text-violet-400 hover:underline"
                      >
                        [채널]
                      </a>
                    </>
                  ) : null}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-zinc-600">
                  {item.desc}
                </div>
                <div className="mt-1.5">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.search)}`}
                    target="_blank"
                    rel="noopener"
                    className="text-xs text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    YouTube에서 검색 &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
