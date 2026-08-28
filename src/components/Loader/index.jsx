import { LoaderWrap, Pill, IndeterminateFill, DeterminateFill, LoaderLabel } from "./style";

/**
 * Umumiy loader.
 *
 * - `progress` berilmasa: holat noma'lum (bitta so'rov) — cheksiz aylanuvchi animatsiya.
 * - `progress` (0-100) berilsa: haqiqiy holatga qarab kengayadi — masalan bir necha
 *   parallel so'rovdan nechtasi tugaganiga qarab hisoblangan foiz.
 */
const Loader = ({ label = "Yuklanmoqda...", progress }) => {
    const isDeterminate = typeof progress === "number" && !Number.isNaN(progress);

    return (
        <LoaderWrap>
            <Pill>
                {isDeterminate ? <DeterminateFill $pct={progress} /> : <IndeterminateFill />}
            </Pill>
            <LoaderLabel>
                {label}
                {isDeterminate ? ` ${Math.round(progress)}%` : ""}
            </LoaderLabel>
        </LoaderWrap>
    );
};

export default Loader;
