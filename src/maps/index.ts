import z from "zod";

export type MapPreference = 1 | 2 | 3 | 4;

export type MapMeta = {
  name: string;
  imgUrl: string;
  pref: MapPreference;
};

const mapNameMapping: Record<string, string> = {
  adlernest: "te_adlernest_b1",
  assault: "mp_assault",
  base: "mp_base",
  beach: "mp_beach",
  braundorf: "braundorf_b7",
  bremen: "te_bremen_b1",
  brewdog: "bd_bunker_b2",
  castle: "mp_castle",
  castle2: "castle2_b3",
  chateau: "te_chateau",
  church: "mp_church",
  cipher: "te_cipher_b5",
  delivery: "te_delivery_b1",
  escape2: "te_escape2",
  frostbite: "te_frostbite",
  frostafari: "frostafari_revamped_b3",
  goldrush: "goldrush_b2",
  ice: "mp_ice",
  keep: "mp_keep",
  kungfugrip: "te_kungfugrip",
  nordic: "te_nordic_b2",
  oasis: "oasis_b1",
  operation: "te_operation_b4",
  password: "mp_password2",
  radar: "te_radar_b1",
  rocket2: "rocket2_b4",
  sub: "mp_sub",
  sub2: "sub2_b8",
  tram2: "tram2",
  ufo: "ufo_homiefix",
  village: "mp_village",
};

export const hasSavedPreferences = () => {
  return !!window.localStorage.getItem(STORAGE_KEY);
};

export const DEFAULT_MAP_CHOICES: MapMeta[] = Object.keys(mapNameMapping)
  .map((key) => ({
    name: key,
    imgUrl: `https://dl.rtcw.eu/levelshots_rtcw/${mapNameMapping[key]}.jpg`,
    pref: 1 as MapPreference,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function generateMapPrefCmd(choices: MapMeta[]) {
  return `!mappref ${choices.map((choice) => `${choice.name}:${choice.pref}`).join(",")}`;
}

const savedPrefSchema = z.object({
  name: z.string(),
  pref: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export type SavedPreference = z.infer<typeof savedPrefSchema>;

const STORAGE_KEY = "SAVED_PREFS_FOR_NOOB";

export function savePreferences(choices: MapMeta[]) {
  const toSave = choices.map(
    (s) => ({ name: s.name, pref: s.pref }) satisfies SavedPreference,
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function getSavedPreferences(): MapMeta[] {
  try {
    const maybePrefs = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "",
    );
    const prefs = z.parse(z.array(savedPrefSchema), maybePrefs);

    const validValues = Object.keys(mapNameMapping);

    for (const pref of prefs) {
      if (!validValues.includes(pref.name)) {
        console.error(`${pref.name} is not a valid map`);
        throw new Error(`${pref.name} is not a valid map`);
      }
    }

    return prefs.map((s) => ({
      ...s,
      imgUrl: `https://dl.rtcw.eu/levelshots_rtcw/${s.name}.jpg`,
    }));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_MAP_CHOICES;
  }
}
