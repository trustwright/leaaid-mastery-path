import type {Metadata} from 'next';
import Guide from './Guide';

export const metadata:Metadata={
 title:'LEAAID Learning Harness Guide',
 description:'Visual platform setup, live harness proof, learning objectives, and achievement guidance for the LEAAID Mastery Path.',
};

export default function GuidePage(){return <Guide/>}
