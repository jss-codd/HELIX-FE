import React from "react";
import GridLayout from "react-grid-layout";
import { SizeMe } from "react-sizeme";

const ComponentGridLayout = ({ components, data }) => {
  return (
    <SizeMe>
      {({ size }) => (
        <GridLayout
          // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          cols={12}
          rowHeight={60}
          width={size.width}
          isDraggable={false}
          isResizable={false}
        >
          {components?.map((component) => (
            <div
              className="rounded ml-3"
              key={component.component._id}
              data-grid={component.layout}
              style={{
                backgroundColor: component.component.background_color,
                padding: 6,
              }}
            >
              {component.component.type === "text" ? (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{
                      fontSize: 20,
                      color: component.component.text_color,
                    }}
                  >
                    <strong>{component.component.title}</strong>
                    <p>
                      {Math.round(
                        Number(data[component.component.data_key]) * 100
                      ) / 100}{" "}
                      {component.component.unit}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{
                      fontSize: 16,
                      color: component.component.text_color,
                    }}
                  >
                    {Math.round(
                      Number(data[component.component.data_key]) * 100
                    ) / 100}{" "}
                    {component.component.unit}
                  </div>
                  <img
                    src={`${process.env.SERVER_URL}${component.component.icon_url}`}
                    height="100%"
                    alt={`component-${component.component.name}`}
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
