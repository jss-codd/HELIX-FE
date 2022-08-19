import React from "react";
import GridLayout from "react-grid-layout";
import { SizeMe } from "react-sizeme";

const ComponentGridLayout = ({
  components,
  componentLayouts,
  setComponentLayouts,
}) => {
  const onLayoutChange = (newLayout) => {
    setComponentLayouts(newLayout);
  };
  return (
    <SizeMe>
      {({ size }) => (
        <GridLayout
          // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          cols={12}
          rowHeight={30}
          onLayoutChange={onLayoutChange}
          width={size.width}
        >
          {components.map((component) => (
            <div
              className="rounded ml-3"
              key={component._id}
              data-grid={componentLayouts.find((it) => it.i === component._id)}
              style={{
                backgroundColor: component.background_color,
                padding: 6,
              }}
            >
              {component.type === "text" ? (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{ fontSize: 20, color: component.text_color }}
                  >
                    <strong>{component.title}</strong>
                    <p>12.34 {component.unit}</p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{ fontSize: 16, color: component.text_color }}
                  >
                    12.34 {component.unit}
                  </div>
                  <img
                    src={`${process.env.SERVER_URL}${component.icon_url}`}
                    height="100%"
                    alt={`component-${component.name}`}
                  />
                </div>
              )}
            </div>
          ))}
        </GridLayout>
      )}
    </SizeMe>
  );
};

export default ComponentGridLayout;
