import Layout from '@/components/Layout';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';

const AboutPage = () => (
  <Layout title="About Me">
    <div className="pt-20">
      <About />
      <Skills />
      <Experience />
    </div>
  </Layout>
);

export default AboutPage;
