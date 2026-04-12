import CourseModel from "../courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await CourseModel.findById(courseId);
    return course?.modules || [];
  }

  async function createModule(courseId, module) {
    const course = await CourseModel.findById(courseId);
    if (!course) return null;

    const newModule = {
      ...module,
      _id: module._id || new Date().getTime().toString(),
      lessons: module.lessons || [],
    };

    if (!course.modules) {
      course.modules = [];
    }

    course.modules.push(newModule);
    await course.save();
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    return await CourseModel.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
  }

  async function updateModule(moduleId, moduleUpdates) {
    const course = await CourseModel.findOne({ "modules._id": moduleId });
    if (!course) return null;

    const module = course.modules.id(moduleId);
    if (!module) return null;

    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}