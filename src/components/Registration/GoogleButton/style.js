import styled from "styled-components";

// Google'ning o'z tugmasi ichkariga render qilinadi — bu shunchaki uni
// markazlashtiruvchi konteyner. min-height Google skripti hali yuklanmagan
// paytda joy "sakramasligi" uchun.
export const GoogleWrap = styled.div`
    display: flex;
    justify-content: center;
    min-height: 44px;

    iframe {
        border-radius: 999px !important;
    }
`;
