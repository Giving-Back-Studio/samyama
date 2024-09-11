export const fetchProjects = async () => {
  const storedProjects = localStorage.getItem('projects');
  return storedProjects ? JSON.parse(storedProjects) : [];
};

export const addProject = async (project) => {
  const projects = await fetchProjects();
  const newProject = { id: Date.now(), createdAt: new Date().toISOString(), ...project };
  const updatedProjects = [...projects, newProject];
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  return newProject;
};

export const updateProject = async (updatedProject) => {
  const projects = await fetchProjects();
  const updatedProjects = projects.map(p => 
    p.id === updatedProject.id ? updatedProject : p
  );
  localStorage.setItem('projects', JSON.stringify(updatedProjects));
  return updatedProject;
};