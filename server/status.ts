import { StatusResponse } from '../shared/schema';

const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhanR5aHRmbmJ5YmVnaGZmbHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDYwNjcsImV4cCI6MjA2NjMyMjA2N30.9V0gkxmrrTkZxAXF2k3wLCfoBCVn4NkGADRFjEraLE8';
const supabase_url = 'https://yajtyhtfnbybeghfflxp.supabase.co';

async function fetchFromSupabase(url: string) {
  const response = await fetch(url, {
    headers: {
      'apikey': anon_key,
      'Authorization': `Bearer ${anon_key}`
    }
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getSpeedData(limit = 1) {
    const url = `${supabase_url}/rest/v1/log_speed?select=*&order=created_at.desc&limit=${limit}`;
    return await fetchFromSupabase(url);
}

export async function getTrackStatus(): Promise<StatusResponse> {
    // 1) Ambil 50 log terbaru
    const logUrl = `${supabase_url}/rest/v1/train_logs?select=checkpoint,status,timestamp&order=timestamp.desc&limit=50`;
    const logs: any[] = await fetchFromSupabase(logUrl);

    // 2) Inisialisasi struktur status
    const points = ['SU', 'SS', 'CP1', 'CP2', 'CP3', 'CP4', 'CP5'];
    const status: StatusResponse = {
        lights: Object.fromEntries(points.map(p => [p, { red: false, yellow: false, green: false }])),
        trains: { running: null, parking: [] },
        route: '–',
        logs: []
    };

    // 3) Simpan logs urutan terbaru
    status.logs = logs.slice().reverse().map(r => ({
        checkpoint: r.checkpoint.toUpperCase(),
        status: r.status.toUpperCase(),
        timestamp: r.timestamp
    }));

    // 4) Tentukan posisi RUNNING
    let runningPosition: string | null = null;
    let lastCheckpointTime: string | null = null;
    let lastStationTime: string | null = null;

    for (const r of status.logs) {
        if (['CP1', 'CP2', 'CP3', 'CP4', 'CP5'].includes(r.checkpoint)) {
            if (lastCheckpointTime === null || r.timestamp > lastCheckpointTime) {
                runningPosition = r.checkpoint;
                lastCheckpointTime = r.timestamp;
            }
        }
        if (['SU', 'SS'].includes(r.checkpoint)) {
            if (lastStationTime === null || r.timestamp > lastStationTime) {
                lastStationTime = r.timestamp;
            }
        }
    }

    if (lastStationTime !== null && lastCheckpointTime !== null && lastStationTime > lastCheckpointTime) {
        runningPosition = null;
    }
    status.trains.running = runningPosition;

    // 5) Cek status SU & SS untuk PARKING
    const stationStatus: { [key: string]: string | null } = { 'SU': null, 'SS': null };
    const stationTimestamps: { [key: string]: string | null } = { 'SU': null, 'SS': null };

    for (const r of status.logs) {
        const cp = r.checkpoint;
        if (['SU', 'SS'].includes(cp)) {
            if (stationTimestamps[cp] === null || r.timestamp > stationTimestamps[cp]!) {
                stationStatus[cp] = r.status;
                stationTimestamps[cp] = r.timestamp;
            }
        }
    }

    status.trains.parking = [];
    for (const cp in stationStatus) {
        if (stationStatus[cp] === 'DETECTING') {
            status.trains.parking.push(cp);
        }
    }

    // 6) Tentukan skenario lampu
    let scenario = -1;
    if (status.trains.running) {
        switch (status.trains.running) {
            case 'CP1': scenario = 0; break;
            case 'CP2': scenario = 1; break;
            case 'CP3': scenario = 2; break;
            case 'CP4': scenario = 3; break;
            case 'CP5': scenario = 4; break;
        }
    } else {
        const suParking = status.trains.parking.includes('SU');
        const ssParking = status.trains.parking.includes('SS');
        if (suParking && ssParking) {
            scenario = 7;
        } else if (suParking) {
            scenario = 5;
        } else if (ssParking) {
            scenario = 6;
        }
    }

    // 7) Atur lampu berdasarkan skenario
    switch (scenario) {
        case 0: // CP1
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].green = true;
            status.lights['CP2'].green = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].green = true;
            status.lights['CP5'].yellow = true;
            break;
        case 1: // CP2
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].red = true;
            status.lights['CP2'].green = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].green = true;
            status.lights['CP5'].yellow = true;
            break;
        case 2: // CP3
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].red = true;
            status.lights['CP2'].red = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].green = true;
            status.lights['CP5'].yellow = true;
            break;
        case 3: // CP4
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].yellow = true;
            status.lights['CP2'].red = true;
            status.lights['CP3'].red = true;
            status.lights['CP4'].green = true;
            status.lights['CP5'].yellow = true;
            break;
        case 4: // CP5
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].green = true;
            status.lights['CP2'].yellow = true;
            status.lights['CP3'].red = true;
            status.lights['CP4'].yellow = true;
            status.lights['CP5'].yellow = true;
            break;
        case 5: // SU
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].green = true;
            status.lights['CP2'].green = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].yellow = true;
            status.lights['CP5'].red = true;
            break;
        case 6: // SS
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].green = true;
            status.lights['CP2'].green = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].yellow = true;
            status.lights['CP5'].red = true;
            break;
        case 7: // SS SU CP3
            status.lights['SU'].red = true;
            status.lights['SS'].red = true;
            status.lights['CP1'].red = true;
            status.lights['CP2'].red = true;
            status.lights['CP3'].green = true;
            status.lights['CP4'].yellow = true;
            status.lights['CP5'].red = true;
            break;
        default:
            for (const key in status.lights) {
                status.lights[key] = { red: false, yellow: false, green: true };
            }
    }

    // 8) Tentukan ROUTE
    if (status.trains.parking.length === 1 && status.trains.running) {
        const p = status.trains.parking[0];
        status.route = (p === 'SU') ? 'Peron Sekunder (SS)' : 'Peron Utama (SU)';
    } else if (status.trains.parking.length === 2 && status.trains.running === 'CP3') {
        status.route = 'Jalur tertutup';
    }

    return status;
}

export async function postSpeedData(data: any) {
    const url = `${supabase_url}/rest/v1/log_speed`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': anon_key,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            kecepatan: data.kecepatan,
            mode: data.mode,
            warna: data.warna ?? null
        })
    });

    if (!response.ok) {
        throw new Error(`Supabase request failed: ${response.statusText}`);
    }
}

export async function postTrainLog(data: any) {
    const url = `${supabase_url}/rest/v1/train_logs`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': anon_key,
            'Authorization': `Bearer ${anon_key}`
        },
        body: JSON.stringify({
            checkpoint: data.checkpoint,
            status: data.status
        })
    });

    if (!response.ok) {
        throw new Error(`Supabase request failed: ${response.statusText}`);
    }
}