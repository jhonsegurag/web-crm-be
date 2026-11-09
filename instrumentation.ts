export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { sequelize } = await import('@/lib/db/connection');
    await import('@/lib/db/models');
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  }
}
