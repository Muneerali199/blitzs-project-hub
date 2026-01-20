import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Users, Zap, Sparkles, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { DeveloperCard } from '@/components/ui/developer-card';
import { projectService } from '../services/project.service';
import { adminService } from '../services/admin.service';

const Index = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await projectService.getAllProjects({ 
          limit: 6, 
          sortBy: 'created_at' 
        });
        
        if (response.success) {
          setFeaturedProjects(response.data.projects);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    const fetchTeamMembers = async () => {
      try {
        setTeamLoading(true);
        const response = await adminService.getAllDevelopers();
        
        if (response.success) {
          setTeamMembers(response.data.developers || []);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchFeaturedProjects();
    fetchTeamMembers();
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Build Your Next Project with{' '}
              <span className="text-blitz-gradient">Blitzs</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A team of expert developers delivering production-ready software and custom solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blitz-gradient hover:opacity-90 text-lg px-8">
                <Link to="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to="/contact">Hire Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Our Work" title="Featured Projects" description="Discover our latest production-ready applications" />
          
          {projectsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-80"></div>
                </div>
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for our latest projects!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project: any, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img
                      src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.short_description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{project.category}</span>
                    <span className="font-bold">{project.is_free ? 'Free' : `$${project.price}`}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(project.tech_stack || []).slice(0, 3).map((tech: string) => (
                      <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/projects/${project.id}`}>
                      View Details
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader badge="The Team" title="Meet Our Experts" description="Talented developers ready to bring your vision to life" />
          
          {teamLoading ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-80"></div>
                </div>
              ))}
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No team members yet</h3>
                <p className="text-muted-foreground">
                  Our team is growing! Check back soon to meet our talented developers.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id || member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-card"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted mx-auto mb-4">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.experience || 'Developer'}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {(member.skills || []).slice(0, 3).map((skill: string) => (
                      <span key={skill} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-center gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                      >
                        <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/team">View Full Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
