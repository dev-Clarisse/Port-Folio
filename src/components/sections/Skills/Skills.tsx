import '@/App.css'
import CrystalScene from "@/components/3D/CrystalScene"






function Skills() {
    return (
        <div>
            <div className="flex flex-col items-center">
                <div className="pt-24 pb-16">

                    <div className="gap-4 mb-1">
                        <h2 className="text-3xl text-lilac-1000 text-center">
                            Technical Skills
                        </h2>
                        <p className="text-lilac-1100 text-center max-w-md">
                            Frontend, Backend, Mobile, Data/ML, Tools&DevOps, Integrations
                        </p>
                    </div>
                </div>

                <CrystalScene />


                <div className="pt-24 pb-16">

                    <div className="gap-4 mb-1" >
                        <h2 className="text-3xl text-lilac-1000 text-center">
                            Soft Skills
                        </h2>
                        <p className="text-lilac-1100 text-center max-w-md">
                            ??
                        </p>
                    </div>
                </div>
            </div>



            

        </div >








    )
}

export default Skills

