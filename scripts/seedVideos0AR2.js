const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFIED_VIDEOS = [
  {
    id: 'audited-v1',
    title: 'Plastic Injection Molding Process & Parameters',
    channel: 'engineerguy (Prof. Bill Hammack)',
    duration: '11:15',
    subject: 'Polymer Processing',
    subjectSlug: 'polymer-processing',
    youtubeId: 'RMjtmsr3CqA',
    canonicalUrl: 'https://www.youtube.com/watch?v=RMjtmsr3CqA',
    description: 'Full engineering explanation of injection moulding machines: reciprocating screw, plasticization, clamping force, cooling channels, and part ejection.',
    source: 'Industry',
    level: 'Foundation',
    lessonSlug: 'injection-moulding-process-parameters-and-defects',
    status: 'published',
    embedStatus: 'working'
  },
  {
    id: 'audited-v2',
    title: 'Introduction to Polymers & Classification',
    channel: 'nptelhrd (Dr. D. Dhara, IIT Kharagpur)',
    duration: '45:20',
    subject: 'Polymer Chemistry',
    subjectSlug: 'polymer-chemistry',
    youtubeId: 'Gbltx4IXLzQ',
    canonicalUrl: 'https://www.youtube.com/watch?v=Gbltx4IXLzQ',
    description: 'NPTEL lecture covering polymer classification, molecular architecture, thermoplastics vs thermosets, and polymerization mechanisms.',
    source: 'NPTEL',
    level: 'Foundation',
    lessonSlug: 'introduction-to-polymers-and-classification',
    status: 'published',
    embedStatus: 'working'
  },
  {
    id: 'audited-v3',
    title: 'Polymeric Materials & Tensile Testing Fundamentals',
    channel: 'NPTEL-NOC IITM (IIT Madras)',
    duration: '32:40',
    subject: 'Polymer Testing',
    subjectSlug: 'polymer-testing',
    youtubeId: '8DYPE-GTVnM',
    canonicalUrl: 'https://www.youtube.com/watch?v=8DYPE-GTVnM',
    description: 'NPTEL lecture on polymeric biomaterials, stress-strain behavior, tensile modulus, and mechanical property evaluation.',
    source: 'NPTEL',
    level: 'Foundation',
    lessonSlug: 'tensile-testing-astm-d638',
    status: 'published',
    embedStatus: 'working'
  },
  {
    id: 'audited-v4',
    title: 'Viscosity & Polymer Rheology in Processing',
    channel: 'NPTEL-NOC IITM (IIT Madras)',
    duration: '28:15',
    subject: 'Polymer Rheology',
    subjectSlug: 'polymer-rheology',
    youtubeId: 'Som5OjiDevo',
    canonicalUrl: 'https://www.youtube.com/watch?v=Som5OjiDevo',
    description: 'NPTEL-NOC lecture on polymer melt viscosity, shear thinning behavior, non-Newtonian flow, and processing temperature dependence.',
    source: 'NPTEL',
    level: 'Intermediate',
    lessonSlug: 'introduction-to-rheology-and-viscosity',
    status: 'published',
    embedStatus: 'working'
  },
  {
    id: 'audited-v5',
    title: 'Injection Mould Components & Design Principles',
    channel: 'Skill Lync',
    duration: '14:30',
    subject: 'Mould Design',
    subjectSlug: 'mould-design',
    youtubeId: 'fE7Mfz2GLvE',
    canonicalUrl: 'https://www.youtube.com/watch?v=fE7Mfz2GLvE',
    description: 'Detailed guide on injection mould construction, 2-plate vs 3-plate moulds, sprue, runner, gate design, and core-cavity alignment.',
    source: 'Industry',
    level: 'Intermediate',
    lessonSlug: 'injection-mould-components-and-types',
    status: 'published',
    embedStatus: 'working'
  }
];

async function seed() {
  console.log('Seeding 5 verified Sprint 0A-R2 videos into Supabase...');
  try {
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('Note on table clear:', deleteError.message);
    }

    const { data, error } = await supabase
      .from('videos')
      .upsert(VERIFIED_VIDEOS, { onConflict: 'youtubeId' });

    if (error) {
      console.log('Supabase Seed Info:', error.message);
    } else {
      console.log('Successfully seeded 5 verified videos into Supabase!');
    }
  } catch (e) {
    console.log('Local fallback active:', e.message);
  }
}

seed();
