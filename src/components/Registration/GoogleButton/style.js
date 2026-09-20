import styled from "styled-components";
import { colors } from "../SignIn/style";

// Google'ning o'z tugmasi ichkariga render qilinadi — konteyner to'liq
// kenglikda (email/parol maydonlari bilan bir xil chiziqda tugaydi) va
// TartibOS qorong'u foniga mos yumshoq soya/chegara beradi. min-height
// Google skripti hali yuklanmagan paytda joy "sakramasligi" uchun.
export const GoogleWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 44px;
    border-radius: 999px;
    overflow: hidden;
    box-shadow: 0 0 0 1px ${colors.hairline};
    transition: box-shadow 0.15s ease;

    &:hover {
        box-shadow: 0 0 0 1px ${colors.amber};
    }

    iframe {
        border-radius: 999px !important;
        width: 100% !important;
    }
`;
