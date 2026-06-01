import { vi, describe, it, expect, afterEach } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
})

// Fresh module per test so module-level isRefreshing / pendingQueue reset to initial state.
async function getHandler() {
  const { default: http } = await import("@/lib/http")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (http.interceptors.response as any).handlers.find(Boolean)
  return { http, rejected: handler.rejected as (error: unknown) => Promise<unknown> }
}

describe("http — response interceptor (401 / refresh)", () => {
  it("passes non-401 errors through unchanged", async () => {
    const { rejected } = await getHandler()
    const error = { response: { status: 500 }, config: {} }
    await expect(rejected(error)).rejects.toStrictEqual(error)
  })

  it("passes network errors (no response object) through unchanged", async () => {
    const { rejected } = await getHandler()
    const error = { response: undefined, config: {} }
    await expect(rejected(error)).rejects.toStrictEqual(error)
  })

  it("redirects to /login when 401 and _retry is already true", async () => {
    vi.stubGlobal("window", { location: { href: "" } })
    const { rejected } = await getHandler()
    const error = {
      response: { status: 401 },
      config: { _retry: true, url: "/api/data" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("/login")
  })

  it("redirects to /login — không deadlock — khi chính refresh endpoint trả về 401", async () => {
    vi.stubGlobal("window", { location: { href: "" } })
    const { rejected } = await getHandler()
    const error = {
      response: { status: 401 },
      // url matches the refresh endpoint — isRefreshing would be true at this point
      config: { url: "/auth/refresh" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("/login")
  })

  it("gọi /auth/refresh khi gặp 401 lần đầu", async () => {
    const { http, rejected } = await getHandler()
    const postSpy = vi.spyOn(http, "post").mockResolvedValueOnce({ data: {} })

    const error = {
      response: { status: 401 },
      config: { url: "/api/data", method: "get" },
    }
    // Refresh is called; retry will fail (no real server in test env) — that's expected
    await expect(rejected(error)).rejects.toBeDefined()
    expect(postSpy).toHaveBeenCalledWith("/auth/refresh")
  })

  it("redirects to /login và reject khi refresh call thất bại", async () => {
    vi.stubGlobal("window", { location: { href: "", pathname: "/" } })
    const { http, rejected } = await getHandler()
    vi.spyOn(http, "post").mockRejectedValueOnce(new Error("network error"))

    const error = {
      response: { status: 401 },
      config: { url: "/api/data", method: "get" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("/login")
  })

  it("không redirect khi đang ở /login — ngăn vòng lặp vô hạn khi AuthProvider gọi getMe()", async () => {
    vi.stubGlobal("window", { location: { href: "", pathname: "/login" } })
    const { rejected } = await getHandler()
    const error = {
      response: { status: 401 },
      config: { _retry: true, url: "/api/data" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("")
  })

  it("không redirect khi đang ở /register", async () => {
    vi.stubGlobal("window", { location: { href: "", pathname: "/register" } })
    const { rejected } = await getHandler()
    const error = {
      response: { status: 401 },
      config: { _retry: true, url: "/api/data" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("")
  })

  it("không redirect khi refresh thất bại và đang ở /login", async () => {
    vi.stubGlobal("window", { location: { href: "", pathname: "/login" } })
    const { http, rejected } = await getHandler()
    vi.spyOn(http, "post").mockRejectedValueOnce(new Error("network error"))

    const error = {
      response: { status: 401 },
      config: { url: "/api/data", method: "get" },
    }
    await expect(rejected(error)).rejects.toBeDefined()
    expect(window.location.href).toBe("")
  })
})
