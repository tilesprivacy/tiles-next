import { ImageResponse } from "@vercel/og"
import { TilesOgLogo } from "@/components/tiles-og-logo"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const ledgerItems = [
  "Revenue",
  "Sponsorships",
  "Compensation",
  "Expenses",
]

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#050505",
          color: "#F4F4F5",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          padding: "54px 58px 46px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            width: "100%",
            height: 6,
            background:
              "linear-gradient(90deg, #CB30E0 0%, #7E35D7 58%, #050505 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -320,
            right: -230,
            display: "flex",
            width: 680,
            height: 680,
            border: "1px solid rgba(203, 48, 224, 0.2)",
            borderRadius: 680,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -150,
            display: "flex",
            width: 520,
            height: 520,
            border: "1px solid rgba(203, 48, 224, 0.12)",
            borderRadius: 520,
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <TilesOgLogo size={48} />
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              Tiles
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(244, 244, 245, 0.56)",
              fontSize: 20,
              letterSpacing: "-0.01em",
            }}
          >
            tiles.run/book/finances
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 590,
              flexDirection: "column",
              paddingRight: 44,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#D964E8",
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Open company
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 560,
                marginTop: 18,
                fontSize: 66,
                fontWeight: 600,
                letterSpacing: "-0.055em",
                lineHeight: 1.02,
              }}
            >
              Our finances are open.
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 550,
                marginTop: 24,
                color: "rgba(244, 244, 245, 0.68)",
                fontSize: 25,
                lineHeight: 1.38,
                letterSpacing: "-0.015em",
              }}
            >
              Revenue, sponsorships, compensation, and expenses, published
              every month.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: 430,
              minHeight: 352,
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 22,
              background:
                "linear-gradient(145deg, rgba(203, 48, 224, 0.11), rgba(255, 255, 255, 0.04))",
              padding: "26px 28px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 18,
                borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Monthly ledger
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#D964E8",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 7,
                    height: 7,
                    marginRight: 8,
                    borderRadius: 7,
                    backgroundColor: "#CB30E0",
                  }}
                />
                Public
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                marginTop: 7,
              }}
            >
              {ledgerItems.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "rgba(244, 244, 245, 0.82)",
                    fontSize: 19,
                  }}
                >
                  <div style={{ display: "flex" }}>{item}</div>
                  <div
                    style={{
                      display: "flex",
                      color: "rgba(244, 244, 245, 0.48)",
                      fontSize: 15,
                    }}
                  >
                    Published
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 18,
                color: "rgba(244, 244, 245, 0.5)",
                fontSize: 15,
              }}
            >
              Transparent down to individual line items
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "rgba(244, 244, 245, 0.46)",
            fontSize: 17,
          }}
        >
          Tiles Book · Finances
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
