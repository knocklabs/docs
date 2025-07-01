import { Tabs } from "@telegraph/tabs";

interface TabsPanelProps {
  value: string;
  children: React.ReactNode;
  renderInBackground?: boolean;
  currentTab?: string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const TabsPanel = ({
  value,
  children,
  renderInBackground = false,
  currentTab,
  className,
  style,
  ...otherProps
}) => {
  const isActive = currentTab === value;

  if (renderInBackground) {
    return (
      <Tabs.Panel
        value={value}
        forceMount
        className={className}
        style={{
          visibility: isActive ? 'visible' : 'hidden',
          overflow: isActive ? 'visible' : 'hidden',
          height: isActive ? 'auto' : '0',
          ...style,
        }}
        aria-hidden={!isActive}
        {...otherProps}
      >
        {children}
      </Tabs.Panel>
    );
  }

  return (
    <Tabs.Panel
      value={value}
      className={className}
      style={style}
      {...otherProps}
    >
      {children}
    </Tabs.Panel>
  );
};

export { TabsPanel };
export type { TabsPanelProps };