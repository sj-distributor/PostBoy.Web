export interface AppSettings {
  serverUrl: string;
}

const settings = (window as any).appSettings;

export async function InitialAppSetting() {
  if ((window as any).appSettings) return (window as any).appSettings;

  await fetch(`${process.env.PUBLIC_URL}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: AppSettings) => {
      (window as any).appSettings = res;
    });
}

export default settings as AppSettings;
