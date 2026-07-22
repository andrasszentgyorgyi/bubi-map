// TEMPORARY diagnostic endpoint. Tries several BKK bicycle-rental variants
// server-side and reports only status + station counts, never the API key.
// Remove once we know which variant carries the Bubi 2.0 fleet.
export default async function handler(request, response) {
    const apiKey = process.env.BKK_API_KEY;
    const path = 'api/query/v1/ws/otp/api/where/bicycle-rental.json';

    const variants = [
        { label: 'futar v3 (current)', url: `https://futar.bkk.hu/${path}?key=${apiKey}&version=3` },
        { label: 'futar v4',           url: `https://futar.bkk.hu/${path}?key=${apiKey}&version=4` },
        { label: 'futar no-version',   url: `https://futar.bkk.hu/${path}?key=${apiKey}` },
        { label: 'go.bkk v3',          url: `https://go.bkk.hu/${path}?key=${apiKey}&version=3` },
    ];

    const results = [];
    for (const v of variants) {
        try {
            const r = await fetch(v.url);
            const contentType = r.headers.get('content-type') || '';
            let count = null, sample = null, snippet = null;
            if (contentType.includes('json')) {
                const j = await r.json();
                count = Array.isArray(j?.data?.list) ? j.data.list.length : null;
                sample = j?.data?.list?.[0]?.name ?? null;
            } else {
                snippet = (await r.text()).slice(0, 120);
            }
            results.push({ label: v.label, status: r.status, contentType, count, sample, snippet });
        } catch (error) {
            results.push({ label: v.label, error: String(error) });
        }
    }

    response.status(200).json({ probe: results });
}
